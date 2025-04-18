import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

import SceneContent from "./scene/SceneContent";
import CameraManager from "./scene/CameraManager";

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
            </Canvas>
        </>
    );
}
