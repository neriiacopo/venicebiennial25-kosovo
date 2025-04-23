import { Sphere, Icosahedron } from "@react-three/drei";

import { useStore } from "../store/useStore.jsx";

export default function Globe({ u, r, offset = 0.1 }) {
    const scale = useStore((state) => state.scale);
    return (
        <>
            <Icosahedron
                args={[r - offset, 100]}
                scale={1}
                position={[0, r, 0]}
                material-transparent={true} // Enables transparency
                material-opacity={1 - u * 2}
                material-color={"black"}
                visible={scale == "xs" ? false : true}
            />
        </>
    );
}
