import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line, Edges } from "@react-three/drei";
import { latLonToXYZ, mirrorPt, interpolateTriple } from "../utils.js";

import { useStore } from "../store/useStore.jsx";

export default function UVMap({
    u,
    res = { x: 36, y: 18 },
    width = 360,
    height = 180,
    scaleFactor = 2,
}) {
    const r = useStore((state) => state.globe.radius);
    const meshRef = useRef();
    const [vertices, setVertices] = useState([]);

    // Create base geometry
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(width, height, res.x, res.y);

        geo.rotateX(-Math.PI / 2);
        geo.scale(1, 1, -1); // Flip normals
        return geo;
    }, []);

    // Extract triplet [sphere, flat, mirrored] for each vertex
    useEffect(() => {
        const ptsMid = geometry.attributes.position.array;
        const triplets = [];

        for (let i = 0; i < ptsMid.length; i += 3) {
            const flat = [ptsMid[i], ptsMid[i + 1], ptsMid[i + 2]];

            const flatScaled = flat.map((v) => v * scaleFactor);

            const sphere = latLonToXYZ([flat[0], 0, flat[2]], r, [0, r, 0]);
            const mirrored = mirrorPt(sphere, [null, 0, null]);

            triplets.push([sphere, flatScaled, mirrored]);
        }

        setVertices(triplets);
    }, [geometry]);

    // Interpolate geometry based on u
    useEffect(() => {
        if (!meshRef.current || vertices.length === 0) return;

        const posAttr = meshRef.current.geometry.attributes.position;
        for (let i = 0; i < vertices.length; i++) {
            const [a, b, c] = vertices[i];
            const interpolated = interpolateTriple(a, b, c, u);
            posAttr.setXYZ(i, ...interpolated);
        }
        posAttr.needsUpdate = true;
        meshRef.current.geometry.computeVertexNormals();
        meshRef.current.geometry.computeBoundingBox();
        useStore.setState({ uvmap: meshRef.current.geometry.clone() });
    }, [u, vertices]);

    // Update uniform time on each frame
    // useFrame((state) => {
    //     if (meshRef.current) {
    //         meshRef.current.material.uniforms.time.value =
    //             state.clock.elapsedTime;
    //     }
    // });

    // Create shader material manually
    // const material = new THREE.ShaderMaterial({
    //     uniforms: {
    //         time: { value: 0 },
    //     },
    //     vertexShader: `
    //       varying vec2 vUv;
    //       void main() {
    //         vUv = uv;
    //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //       }
    //     `,
    //     fragmentShader: `
    //       varying vec2 vUv;
    //       uniform float time;

    //       // Simple random function
    //       float random(vec2 st) {
    //         return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    //       }

    //       void main() {
    //         // First noise based on UV and time
    //         float n1 = random(vUv * 10.0 + time * 0.5);
    //         // Second noise with a different scale
    //         float n2 = random(vUv * 30.0 - time * 0.2);

    //         // Multiply them together
    //         float blended = n1 * n2;

    //         gl_FragColor = vec4(vec3(blended), 1.0);
    //       }
    //     `,
    // });

    return (
        <>
            <mesh
                ref={meshRef}
                geometry={geometry}
                visible={false}
                // material={material}
                // material-transparent={true}
                // material-opacity={0.2}
            ></mesh>
        </>
    );
}
