import { Sphere, Icosahedron } from "@react-three/drei";

export default function Globe({ u, r, offset = 0.1 }) {
    return (
        <>
            <Icosahedron
                args={[r - offset, 100]}
                scale={1}
                position={[0, r, 0]}
                material-transparent={true} // Enables transparency
                material-opacity={1 - u * 2}
                material-color={"black"}
            />
        </>
    );
}
