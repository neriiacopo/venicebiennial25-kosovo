import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import SceneContent from "./SceneContent";
import CameraManager from "./CameraManager";

import FxASCII from "./FxASCII.jsx";

export default function App() {
    return (
        <>
            <Canvas
                camera={{
                    near: 0.01,
                    far: 1000,
                }}
                id="canvas"
            >
                {/* switch world axis -> Z is up */}
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    <SceneContent />
                    <CameraManager />
                </group>
                {/* <FxASCII /> */}
            </Canvas>
        </>
    );
}
