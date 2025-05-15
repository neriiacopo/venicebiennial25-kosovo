import { useStore } from "../store/useStore.jsx";
import { latLonToXYZ } from "../utils.js";

export default function Trails({ u }) {
    const trail = useStore((state) => state.trail);
    const globe = useStore((state) => state.globe);

    const scale = useStore((state) => state.scale);

    return (
        <group>
            {scale == "xl" &&
                trail &&
                trail.map((t, index) =>
                    t.map((location, locIndex) => {
                        const position = latLonToXYZ(
                            [location.lon, 0, location.lat],
                            globe.radius,
                            globe.center
                        );
                        const color = "yellow";
                        const size = 0.5;

                        return (
                            <mesh
                                position={position}
                                key={`${index}-${locIndex}`}
                            >
                                <sphereGeometry
                                    args={[
                                        size * (locIndex / t.length),
                                        10,
                                        10,
                                    ]}
                                />
                                <meshStandardMaterial
                                    color={color}
                                    // emissive={color}
                                    emissiveIntensity={100}
                                />
                            </mesh>
                        );
                    })
                )}
        </group>
    );
}
