import {
    excelToJson,
    fetchTrailData,
    getCenterLastPositions,
    latLonToXYZ,
} from "../utils.js";
import { useStore } from "../store/useStore.jsx";
import * as THREE from "three";

import { useLoadingStore } from "../store/loadingStore";

export default async function loadData() {
    console.log("🔵 loadData started");
    const setDataProgress = useLoadingStore.getState().setDataProgress;
    setDataProgress(0);

    const globe = useStore.getState().globe;
    const data = await excelToJson("data/content.xlsx");

    setDataProgress(10);

    // All 86 items below kick off in the same synchronous tick (Promise.all
    // starts every download at once), so bumping progress when an item
    // *starts* just fires 86 times back-to-back before anything has
    // actually loaded -- the bar jumps straight to ~70% and then sits
    // still. Bumping on *completion* instead spreads the updates out over
    // real time, since network loads finish as data actually arrives.
    let loadedAssets = 0;
    const totalAssets = data.data.length;
    const bumpAssetProgress = () => {
        loadedAssets++;
        setDataProgress(10 + (loadedAssets / totalAssets) * 70); // 10 -> 80
    };

    const processedData = await Promise.all(
        data.data.map(async (item, i) => {
            const path = `data/${item.folder}/${item.image}.${item.extension}`;

            if (
                ["png", "jpg", "jpeg", "webp", "JPG"].includes(item.extension)
            ) {
                try {
                    const texture = await new Promise((resolve, reject) =>
                        new THREE.TextureLoader().load(
                            path,
                            resolve,
                            undefined,
                            () => reject(new Error(`Image not found: ${path}`))
                        )
                    );

                    // Color-managed (r3f/three r152+) textures must have their
                    // colorSpace set BEFORE the first GPU upload, or the upload bakes
                    // in the wrong internal format. Normally react-three-fiber sets
                    // this for us the moment the texture is attached via a JSX `map`
                    // prop -- but it does so with a plain property assignment, not
                    // `needsUpdate = true`, so it never triggers a re-upload. Since we
                    // now force the upload early ourselves (GPU offload, below) via
                    // renderer.initTexture(), we must set colorSpace ourselves first,
                    // otherwise that early upload permanently bakes in NoColorSpace
                    // (linear) and the sprite stays washed out/desaturated forever,
                    // even once r3f "corrects" the property afterwards.
                    texture.colorSpace = THREE.SRGBColorSpace;

                    const image = texture.image;
                    const aspectRatio = image?.width / image?.height || 1;

                    return {
                        ...item,
                        id: i,
                        img: { texture, aspectRatio, path },
                    };
                } catch (err) {
                    console.warn(err.message);
                    return {
                        ...item,
                        id: i,
                        img: {
                            texture: null,
                            aspectRatio: null,
                            path: null,
                        },
                    };
                } finally {
                    bumpAssetProgress();
                }
            } else if (["mp4", "webm", "mov", "MOV"].includes(item.extension)) {
                const video = document.createElement("video");
                video.src = path;
                video.crossOrigin = "anonymous";
                video.muted = true;
                video.playsInline = true;
                video.loop = true;

                try {
                    await new Promise((resolve, reject) => {
                        const onError = () =>
                            reject(new Error(`Video failed to load: ${path}`));
                        video.addEventListener("error", onError, {
                            once: true,
                        });
                        video.addEventListener(
                            "loadeddata",
                            () => {
                                video.removeEventListener("error", onError);
                                resolve();
                            },
                            { once: true }
                        );

                        video.load();
                    });

                    const texture = new THREE.VideoTexture(video);
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.format = THREE.RGBAFormat;
                    // Same reasoning as the image branch above -- must be set before
                    // the early GPU offload upload, not left for r3f to fix up later.
                    texture.colorSpace = THREE.SRGBColorSpace;

                    const image = texture.image;
                    const aspectRatio =
                        video.videoWidth / video.videoHeight || 1;

                    return {
                        ...item,
                        id: i,
                        img: { texture, aspectRatio },
                        video: { path, element: video },
                    };
                } catch (err) {
                    console.warn(err.message);
                    return {
                        ...item,
                        id: i,
                        img: {
                            texture: null,
                            aspectRatio: null,
                            path: null,
                        },
                    };
                } finally {
                    bumpAssetProgress();
                }
            } else {
                // Unsupported extension fallback
                bumpAssetProgress();
                return {
                    ...item,
                    id: i,
                    img: {
                        texture: null,
                        aspectRatio: null,
                        path: null,
                    },
                };
            }
        })
    );

    setDataProgress(80);

    const reducedTrails = await fetchTrailData(
        "data/movebank_data_grouped.json",
        globe
    );

    // Overwrite position of birds
    const lastLatLons = [];
    processedData.forEach((entry) => {
        const birds = reducedTrails.map((t) => t.name);
        if (birds.includes(entry.title)) {
            const trail = reducedTrails.find((t) => t.name === entry.title);
            entry.position = trail.lastPosition;
            lastLatLons.push(trail.lastLatLon);
        } else {
            entry.position = null;
        }
    });

    // Cluster xs entries based on title
    // 1. find unique cluster titles
    const clusterTitles = [
        ...new Set(
            processedData
                .filter((e) => e.section === "xs" && e.title != null)
                .map((e) => e.title)
        ),
    ];

    console.log(clusterTitles);

    // 2. compute centroids
    const minX = -80,
        maxX = 80;
    const minY = -30,
        maxY = 30;

    const centroids = {};
    clusterTitles.forEach((title, i) => {
        centroids[title] = {
            x: minX + (i / (clusterTitles.length - 1)) * (maxX - minX),
            y: minY + Math.random() * (maxY - minY),
            z: 0,
        };
    });

    function flipLon(x) {
        return x < 180 ? -(180 - x) : 180 - x;
    }

    // 3. jitter helper
    function jitter(radius = 1.5) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * Math.sqrt(Math.random());
        return {
            x: (Math.cos(angle) + 1) * dist,
            y: (Math.sin(angle) + 1) * dist,
            z: 0,
        };
    }

    // 4. mutate processedData
    processedData.forEach((entry) => {
        if (entry.section !== "xs" || entry.title == null) return;

        const base = centroids[entry.title];
        const offset = jitter(10);

        const latlon = {
            x: flipLon(base.x + offset.x),
            y: base.y + offset.y,
            z: 0,
        };

        entry.position = latLonToXYZ(
            [latlon.x, 0, latlon.y],
            globe.radius - 1,
            globe.center.map((c) => c * -1)
        );
    });

    setDataProgress(90);

    // --- GPU offload -------------------------------------------------
    // Everything above is exactly the original loading approach: one
    // blocking batch, all images/videos in parallel. The one thing added
    // here is pushing every already-loaded texture onto the GPU before
    // announcing readiness, instead of leaving that upload to happen
    // implicitly the first time each sprite is actually drawn (which is
    // what made the landing -> scene transition heavy: a burst of GPU
    // uploads landing in a single frame). initTexture() only enqueues the
    // upload; gl.finish() is the one deliberate, one-time blocking call
    // that waits for the GPU to have genuinely caught up before we call
    // the scene "ready".
    const renderer = useStore.getState().glRenderer;
    if (renderer) {
        const texturesToWarm = processedData
            .map((entry) => entry.img?.texture)
            .filter(Boolean);
        const totalTextures = texturesToWarm.length;

        for (let i = 0; i < totalTextures; i++) {
            try {
                renderer.initTexture(texturesToWarm[i]);
            } catch (err) {
                console.warn("initTexture failed:", err.message);
            }

            // initTexture() itself just enqueues the upload -- it's nearly
            // instant -- so without yielding here this loop finishes in one
            // synchronous burst and the browser never gets a chance to
            // paint the in-between values (same issue as the asset-loading
            // fix above). Yielding every few textures lets the bar visibly
            // tick through 90 -> 99 instead of sitting still.
            if (totalTextures > 0 && (i % 4 === 3 || i === totalTextures - 1)) {
                setDataProgress(90 + ((i + 1) / totalTextures) * 9);
                await new Promise((resolve) => requestAnimationFrame(resolve));
            }
        }

        try {
            // The one part of this that genuinely can't be subdivided:
            // gl.finish() is a single opaque blocking call that waits for
            // the GPU to actually catch up on everything enqueued above.
            // There's no partial-completion signal to report progress on,
            // so a short pause here before jumping to 100 is real GPU work
            // finishing, not a UI bug.
            renderer.getContext().finish();
        } catch (err) {
            console.warn("GPU finish failed:", err.message);
        }
    }

    useStore.setState({
        db: processedData,
        narratives: data.columns,
        ready: true,
        // Gates the "Discover" UI (see NavPages.jsx / useStore.jsx) — only
        // flips once every asset has loaded AND been pushed to the GPU
        // above, so entering the scene has nothing left to upload.
        dataReady: true,
        trails: reducedTrails,
        birdCenter: getCenterLastPositions(lastLatLons),
    });

    setDataProgress(100);

    console.log("🔵 loadData ended");

    return true;
}
