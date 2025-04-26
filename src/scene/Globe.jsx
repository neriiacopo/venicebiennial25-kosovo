import * as THREE from "three";
import { Sphere, Icosahedron, Edges, Html } from "@react-three/drei";
// import { EffectComposer, Outline } from "@react-three/postprocessing";

import { useStore } from "../store/useStore.jsx";

export default function Globe({ u, r, offset = 0.1 }) {
    const scale = useStore((state) => state.scale);
    return (
        <>
            <Icosahedron
                args={[r - offset, 100]}
                scale={[1 + 1 * u, 1, 1 + 1 * u]}
                position={[0, r, 0]}
                material-transparent={true} // Enables transparency
                material-opacity={1 - u * 2}
                // material-opacity={2 - u * 2}
                material-color={"black"}
                // visible={scale == "xs" ? false : true}
            />
            {/* <EffectComposer>
                <Outline
                    blur
                    edgeStrength={10}
                    width={1000}
                    color="black"
                />
            </EffectComposer> */}

            <VerticalCircle
                radius={r * 2}
                segments={100}
                position={[0, r, 0]}
                scale={2 - u}
                lineWidth={u}
                color={"black"}
            />
        </>
    );
}

const VerticalCircle = ({
    radius = 1,
    segments = 64,
    position = [0, 0, 0],
    scale = 1,
    lineWidth = 1,
    color,
}) => {
    if (lineWidth < 0.5) return null;

    return (
        <mesh
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
            scale={scale}
        >
            <circleGeometry args={[radius, segments]} />
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
};
