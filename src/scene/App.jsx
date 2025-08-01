import { useEffect, useState, Suspense, useRef } from "react";
import * as THREE from "three";
import { excelToJson } from "../utils.js";
import { Canvas } from "@react-three/fiber";

import SceneContent from "./SceneContent";
import CameraManager from "./CameraManager";

import { useStore } from "../store/useStore.jsx";
import { fetchTrailData, getCenterLastPositions } from "../utils.js";

import Loader from "./Loader.jsx";
import { ConstructionOutlined } from "@mui/icons-material";
import { red } from "@mui/material/colors";

export default function App() {
    const [ready, setReady] = useState(false);
    const setScale = useStore((state) => state.setScale);
    const landing = useStore((state) => state.landing);
    const globe = useStore((state) => state.globe);

    useEffect(() => {
        async function Init() {
            const data = await excelToJson("data/content.xlsx");

            const processedData = await Promise.all(
                data.data.map(async (item, i) => {
                    const path = `data/${item.folder}/${item.image}.${item.extension}`;

                    if (
                        ["png", "jpg", "jpeg", "webp"].includes(item.extension)
                    ) {
                        try {
                            const texture = await new Promise(
                                (resolve, reject) =>
                                    new THREE.TextureLoader().load(
                                        path,
                                        resolve,
                                        undefined,
                                        () =>
                                            reject(
                                                new Error(
                                                    `Image not found: ${path}`
                                                )
                                            )
                                    )
                            );

                            const image = texture.image;
                            const aspectRatio =
                                image?.width / image?.height || 1;

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
                    } else if (
                        ["mp4", "webm", "mov"].includes(item.extension)
                    ) {
                        const video = document.createElement("video");
                        video.src = path;
                        video.crossOrigin = "anonymous";
                        video.muted = true;
                        video.playsInline = true;
                        video.loop = true;

                        try {
                            await new Promise((resolve, reject) => {
                                const onError = () =>
                                    reject(
                                        new Error(
                                            `Video failed to load: ${path}`
                                        )
                                    );
                                video.addEventListener("error", onError, {
                                    once: true,
                                });
                                video.addEventListener(
                                    "loadeddata",
                                    () => {
                                        video.removeEventListener(
                                            "error",
                                            onError
                                        );
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

            const lastLatLons = [];

            processedData.forEach((entry) => {
                const birds = reducedTrails.map((t) => t.name);

                if (birds.includes(entry.title)) {
                    entry.position = reducedTrails.find(
                        (t) => t.name === entry.title
                    ).lastPosition;

                    lastLatLons.push(
                        reducedTrails.find((t) => t.name === entry.title)
                            .lastLatLon
                    );
                } else {
                    entry.position = null;
                }
            });

            useStore.setState({
                db: processedData,
                narratives: data.columns,
                ready: true,
                trails: reducedTrails,
                birdCenter: getCenterLastPositions(lastLatLons),
            });
            setReady(true);
        }

        Init();
    }, []);

    useEffect(() => {
        if (!landing) {
            setScale("xl");
        }
    }, [landing]);

    if (!ready) return null; // or a loading spinner

    return (
        <Canvas
            camera={{
                near: 0.01,
                far: 10000,
                position: [0, 0, -1000],
                fov: 10,
            }}
            id="canvas"
        >
            <Suspense fallback={<Loader />}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    <SceneContent />
                    <CameraManager />
                </group>
            </Suspense>
        </Canvas>
    );
}
