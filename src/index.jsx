import "./style.css";
import ReactDOM from "react-dom/client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { excelToJson } from "./utils.js";
import { useStore } from "./store/useStore.jsx";
import App from "./scene/App";
import Ui from "./ui/Ui";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./ui/theme.js";

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<AppWrapper />);

function AppWrapper() {
    const [ready, setReady] = useState(true);
    const setScale = useStore((state) => state.setScale);

    useEffect(() => {
        async function Init() {
            const data = await excelToJson("data/content.xlsx");

            const processedData = await Promise.all(
                data.data.map(async (item, i) => {
                    const path = `data/${item.folder}/${item.image}.${item.extension}`;

                    if (
                        ["png", "jpg", "jpeg", "webp"].includes(item.extension)
                    ) {
                        const texture = await new Promise((resolve) =>
                            new THREE.TextureLoader().load(path, resolve)
                        );

                        const aspectRatio = await new Promise((resolve) => {
                            const img = new Image();
                            img.src = path;
                            img.onload = () =>
                                resolve(img.width / img.height || 1);
                        });

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

                        await new Promise((resolve) => {
                            video.addEventListener("loadeddata", resolve, {
                                once: true,
                            });
                        });

                        // Ensure it's at the very first frame
                        video.currentTime = 0;

                        await new Promise((resolve) => {
                            video.addEventListener("seeked", resolve, {
                                once: true,
                            });
                        });

                        // Now draw the frame to a canvas
                        const canvas = document.createElement("canvas");
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        const texture = new THREE.CanvasTexture(canvas);
                        const aspectRatio =
                            video.videoWidth / video.videoHeight || 1;

                        return {
                            ...item,
                            id: i,
                            img: { texture, aspectRatio },
                            video: { path },
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

            useStore.setState({
                db: processedData,
                narratives: data.columns,
            });

            setScale("m");

            // setReady(true);
        }

        // Template call for whitestork mapping
        async function getTrail() {
            const url = "trail_test.json";

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                useStore.setState({ trail: json.data });
            } catch (error) {
                console.error(error.message);
            }
        }

        getTrail();
        Init();
    }, []);

    if (!ready) return null; // or a loading spinner

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Ui />
            <App />
        </ThemeProvider>
    );
}
