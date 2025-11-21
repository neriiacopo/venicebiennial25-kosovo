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

    const processedData = await Promise.all(
        data.data.map(async (item, i) => {
            const path = `data/${item.folder}/${item.image}.${item.extension}`;

            setDataProgress((i / data.data.length) * 80);
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
                }
            } else {
                // Unsupported extension fallback
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

    useStore.setState({
        db: processedData,
        narratives: data.columns,
        ready: true,
        trails: reducedTrails,
        birdCenter: getCenterLastPositions(lastLatLons),
    });

    setDataProgress(100);

    console.log("🔵 loadData ended");

    return true;
}

// let appDataPromise = null;

// export default function loadAppData() {
//     if (!appDataPromise) {
//         console.log("🔵 Starting data load (first call)");
//         appDataPromise = loadAppData();
//     } else {
//         console.log("🟢 Reusing existing promise");
//     }
//     return appDataPromise;
// }
