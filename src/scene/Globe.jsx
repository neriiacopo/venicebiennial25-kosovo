import * as THREE from "three";
import { useMemo, useEffect } from "react";
import { Sphere } from "@react-three/drei";

import { latLonToXYZ } from "../utils.js";

import { useStore } from "../store/useStore.jsx";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Globe({ u, offset = 0.1 }) {
    const r = useStore((state) => state.globe.radius);
    const texturePath = useStore((state) => state.globe.texture);

    const texture = useLoader(TextureLoader, texturePath);

    return (
        <Sphere
            args={[r - offset, 100, 100]}
            scale={[1, 1, 1]}
            position={[0, r, 0]}
            // material-color={new THREE.Color(0x000000)}
            material-transparent={true}
            material-opacity={1 - u * 2}
            material-map={texture}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
        />
    );
}

function SphereAtLatLon({
    location,
    world = { radius, center },
    color = "red",
    size = 10,
}) {
    const position = latLonToXYZ(
        [location.lat, 0, location.lon],
        world.radius,
        world.center
    );

    return (
        <group>
            <mesh position={position}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
}
