import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

export default function Trail({
    data,
    name,
    active = false,
    color = "white",
    thickness = 2,
    dashed = true,
}) {
    const [progress, setProgress] = useState(0); // 0 to 1
    const startTime = useRef(null);
    const duration = 5; // seconds

    const positions = useMemo(() => {
        return data.map((p) => new THREE.Vector3(...p));
    }, [data]);

    // Animate progress
    useFrame((state) => {
        if (!startTime.current)
            startTime.current = state.clock.getElapsedTime();

        const elapsed = state.clock.getElapsedTime() - startTime.current;
        const t = Math.min(elapsed / duration, 1); // clamp to [0, 1]
        setProgress(t);
    });

    // Interpolate visible positions
    const visiblePoints = useMemo(() => {
        if (positions.length < 2) return positions;
        const total = positions.length;
        const count = Math.floor(progress * total);

        const result = positions.slice(0, count + 1);

        // Interpolate between last and next point
        if (count < total - 1) {
            const last = positions[count];
            const next = positions[count + 1];
            const localT = progress * total - count;

            const interp = new THREE.Vector3().lerpVectors(last, next, localT);
            result.push(interp);
        }

        return result;
    }, [positions, progress]);

    if (!positions.length) return null;

    return (
        <Line
            points={visiblePoints}
            color={color}
            lineWidth={thickness}
            dashed={dashed}
            dashSize={0.3}
            gapSize={0.6}
        />
    );
}
