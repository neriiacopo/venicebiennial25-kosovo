import React from "react";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { excelToJson } from "../utils.js";
import { Canvas, useFrame } from "@react-three/fiber";
import SceneContent from "./SceneContent";
import CameraManager from "./CameraManager";

import { useStore } from "../store/useStore.jsx";

export default function App() {
    const [ready, setReady] = useState(true);
    const setScale = useStore((state) => state.setScale);
    const landing = useStore((state) => state.landing);

    useEffect(() => {
        async function Init() {
            console.time("Init() Total");

            console.time("Load Excel");
            const data = await excelToJson("data/content.xlsx");
            console.timeEnd("Load Excel");

            console.time("Process Items");
            const processedData = await Promise.all(
                data.data.map(async (item, i) => {
                    const path = `data/${item.folder}/${item.image}.${item.extension}`;

                    if (
                        ["png", "jpg", "jpeg", "webp"].includes(item.extension)
                    ) {
                        console.time(`Image Load ${i}`);
                        const texture = await new Promise((resolve) =>
                            new THREE.TextureLoader().load(path, resolve)
                        );
                        console.timeEnd(`Image Load ${i}`);

                        const image = texture.image;
                        const aspectRatio = image.width / image.height || 1;

                        return {
                            ...item,
                            id: i,
                            img: { texture, aspectRatio, path },
                        };
                    } else if (
                        ["mp4", "webm", "mov"].includes(item.extension)
                    ) {
                        const video = document.createElement("video");
                        video.src = path;
                        video.crossOrigin = "anonymous";
                        video.muted = true;
                        video.playsInline = true;
                        video.loop = true;
                        video.load();

                        console.time(`Video Load ${i}`);
                        await new Promise((resolve) => {
                            video.addEventListener("loadeddata", resolve, {
                                once: true,
                            });
                        });
                        console.timeEnd(`Video Load ${i}`);

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
                    } else {
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
            console.timeEnd("Process Items");

            console.time("Set Store State");
            useStore.setState({
                db: processedData,
                narratives: data.columns,
                ready: true,
            });
            console.timeEnd("Set Store State");

            console.time("Set Scale");
            setScale("xl");
            console.timeEnd("Set Scale");

            console.timeEnd("Init() Total");
        }

        Init();
    }, []);

    if (!ready || landing) return null; // or a loading spinner

    return (
        <Canvas
            camera={{
                near: 0.01,
                far: 10000,
                position: [0, 0, -1000],
                fov: 10,
            }}
            dpr={[1, 1.1]}
            id="canvas"
        >
            <group rotation={[-Math.PI / 2, 0, 0]}>
                <SceneContent />
                <CameraManager />
            </group>
        </Canvas>
    );
}
