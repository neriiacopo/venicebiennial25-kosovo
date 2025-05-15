// import { IcosahedronGeometry } from "three";
import { Icosahedron, Box, Sphere } from "@react-three/drei";
import { useStore } from "../store/useStore.jsx";
import { latLonToXYZ } from "../utils.js";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export default function Trails({ u }) {
    const trail = useStore((state) => state.trail);
    const globe = useStore((state) => state.globe);

    const scale = useStore((state) => state.scale);

    const [currentIndex, setCurrentIndex] = useState(0);
    const trailRef = useRef([]);

    // useFrame(() => {
    //     if (!trail || trail.length === 0) return;

    //     setCurrentIndex((prevIndex) => {
    //         const nextIndex = (prevIndex + 1) % trail[0].length;
    //         return nextIndex;
    //     });

    //     trailRef.current = trail.map((t) => t.slice(0, currentIndex + 1));
    // });

    return (
        <group>
            {scale == "xl" &&
                trail &&
                trail.map((t, index) =>
                    t.map((location, locIndex) => {
                        const position = latLonToXYZ(
                            [location.lon, 0, location.lat],
                            globe.radius + 1,
                            globe.center
                        );
                        const color = "orange";
                        const size = 0.0;

                        return (
                            <group key={`${index}-${locIndex}`}>
                                <mesh position={position}>
                                    <Sphere
                                        args={[
                                            locIndex === currentIndex
                                                ? 0.3
                                                : size,
                                            // locIndex === t.length - 1 ? 1 : size,

                                            // locIndex === t.length - 1
                                            //     ? 1
                                            //     : size * (locIndex / t.length),
                                            // ,
                                            10,
                                            10,
                                        ]}
                                    >
                                        <meshStandardMaterial
                                            color={color}
                                            emissiveIntensity={100}
                                        />
                                    </Sphere>
                                </mesh>
                                {/* {locIndex === t.length - 1 && (
                                    <sprite
                                        position={position}
                                        size={10}
                                        color={color}
                                        scale={[10, 10, 10]}
                                    ></sprite>
                                    // <mesh position={position}>
                                    //     <Icosahedron
                                    //         args={[1, 1, 1, 1, 1, 1, 1, 1]}
                                    //     >
                                    //         <meshStandardMaterial
                                    //             color={color}
                                    //         />
                                    //     </Icosahedron>
                                    // </mesh>
                                )} */}
                            </group>
                        );
                    })
                )}
        </group>
    );
}
