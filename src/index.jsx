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
    const [ready, setReady] = useState(false);
    const setScale = useStore((state) => state.setScale);

    useEffect(() => {
        async function Init() {
            const data = await excelToJson("data/content.xlsx");

            const processedData = await Promise.all(
                data.data.map(async (item, i) => {
                    const path = `data/imgs/${item.image}.${item.extension}`;

                    const texture = await new Promise((resolve) =>
                        new THREE.TextureLoader().load(path, resolve)
                    );

                    const aspectRatio = await new Promise((resolve) => {
                        const img = new Image();
                        img.src = path;
                        img.onload = () => resolve(img.width / img.height || 1);
                    });

                    return {
                        ...item,
                        id: i,
                        img: { texture, aspectRatio, path },
                    };
                })
            );

            console.log(processedData);
            useStore.setState({
                db: processedData,
                narratives: data.columns,
            });

            setScale("m");
            setReady(true);
        }

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
