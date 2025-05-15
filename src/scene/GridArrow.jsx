import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

import { latLonToXYZ, mirrorPt, interpolateTriple } from "../utils.js";

import { useStore } from "../store/useStore.jsx";

export default function GridArrow({
    u,
    res = { x: 36, y: 18 },
    width = 360,
    height = 180,
    scaleFactor = 2,
    arrowFactor = 0.1,
}) {
    const ref = useRef();
    const lineCount = useMemo(() => (res.x + 1) * (res.y + 1) * 4, [res]);
    const r = useStore((state) => state.globe.radius);

    // Allocate a single geometry for all line segments
    const geometry = useMemo(() => {
        const positions = new Float32Array(lineCount * 2 * 3);
        return new THREE.BufferGeometry().setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
    }, [lineCount]);

    useFrame(() => {
        if (!ref.current) return;

        const positions = ref.current.geometry.attributes.position.array;
        let ptr = 0;
        const stepX = width / res.x;
        const stepZ = height / res.y;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        for (let i = 0; i <= res.x; i++) {
            const x = -halfWidth + i * stepX;

            for (let j = 0; j <= res.y; j++) {
                const z = -halfHeight + j * stepZ;

                // Make flat coordinates
                const vectors = [];
                if (i == 0 && i == res.x && j == 0 && j == res.y) {
                    continue;
                } else {
                    vectors.push([x, 0, z + stepZ / 2]);
                    vectors.push([x + stepX / 2, 0, z]);

                    vectors.push([x, 0, z - stepZ / 2]);
                    vectors.push([x - stepX / 2, 0, z]);
                }

                // Create segments for states
                for (const vect of vectors) {
                    // Flat grid
                    const startFlat = [x, 0, z];
                    const endFlat = vect;
                    // Globe coordinates
                    const startSpherical = latLonToXYZ(startFlat, r, [0, r, 0]);
                    const endSpherical = latLonToXYZ(endFlat, r, [0, r, 0]);
                    // Inverted Globe coordinates
                    const startInvSpherical = mirrorPt(
                        latLonToXYZ(startFlat, r, [0, r, 0]),
                        [null, 0, null]
                    );
                    const endInvSpherical = mirrorPt(
                        latLonToXYZ(endFlat, r, [0, r, 0]),
                        [null, 0, null]
                    );

                    const startPts = interpolateTriple(
                        startSpherical,
                        startFlat.map((v) => v * scaleFactor),
                        startInvSpherical.map(
                            (p, index) =>
                                endInvSpherical[index] +
                                (p - endInvSpherical[index]) * (arrowFactor * 8)
                        ),
                        u
                    );
                    const endPts = interpolateTriple(
                        endSpherical.map(
                            (p, index) =>
                                startSpherical[index] +
                                (p - startSpherical[index]) * arrowFactor
                        ),
                        endFlat.map((v) => v * scaleFactor),
                        endInvSpherical,
                        u
                    );

                    // Add instances
                    positions.set(startPts, ptr);
                    ptr += 3;
                    positions.set(endPts, ptr);
                    ptr += 3;
                }
            }
        }

        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <lineSegments
            ref={ref}
            geometry={geometry}
        >
            <lineBasicMaterial
                attach="material"
                color="gray"
            />
        </lineSegments>
    );
}
