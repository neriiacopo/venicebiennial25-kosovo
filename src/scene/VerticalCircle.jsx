import * as THREE from "three";
import { Edges } from "@react-three/drei";

export default function VerticalCircle({
    r = 1,
    segments = 100,
    position = [0, 0, 0],
    scale = 1,
    lineWidth = 1,
    color,
}) {
    if (lineWidth < 0.5) return null;

    return (
        <mesh
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
            scale={scale}
        >
            <circleGeometry args={[r, segments]} />
            <meshBasicMaterial
                color={"black"}
                transparent={true}
                opacity={0}
            />
            <Edges
                scale={1.2}
                threshold={0.01}
                color={color}
                lineWidth={2}
            />
        </mesh>
    );
}
