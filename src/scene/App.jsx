import { useEffect, useState, Suspense, useRef } from "react";
import { Typography } from "@mui/material";
import * as THREE from "three";
import { excelToJson } from "../utils.js";
import { Canvas } from "@react-three/fiber";

import SceneContent from "./SceneContent";
import CameraManager from "./CameraManager";

import { useStore } from "../store/useStore.jsx";
import {
    fetchTrailData,
    getCenterLastPositions,
    createResource,
} from "../utils.js";

import Loader from "./Loader.jsx";
import loadAppData from "../loading/loadAppData.js";

export default function App() {
    const setScale = useStore((state) => state.setScale);
    const landing = useStore((state) => state.landing);

    useEffect(() => {
        if (!landing) {
            setScale("xl");
        }
    }, [landing]);

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
            {/* <Suspense fallback={<Loader />}> */}
            <group rotation={[-Math.PI / 2, 0, 0]}>
                <SceneContent />
                <CameraManager />
            </group>
            {/* </Suspense> */}
        </Canvas>
    );
}
