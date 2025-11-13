import * as THREE from "three";
import { Sphere } from "@react-three/drei";
import { useMemo, useEffect } from "react";

import { latLonToXYZ } from "../utils.js";

import { useStore } from "../store/useStore.jsx";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Globe({ u, offset = 0.1 }) {
    const r = useStore((state) => state.globe.radius);
    const texturePath = useStore((state) => state.globe.texture);

    const texture = useLoader(TextureLoader, texturePath);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uBlend: { value: 0.5 },
                uOpacity: { value: 1.0 },
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uBlend;
        uniform float uOpacity;

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          vec3 finalColor = mix(texColor.rgb, vec3(0.0), uBlend);
          gl_FragColor = vec4(finalColor, texColor.a * uOpacity);
        }
      `,
            transparent: true,
        });
    }, [texture]);

    // Update opacity when `u` changes
    useEffect(() => {
        material.uniforms.uOpacity.value = 1 - u * 2;
    }, [u, material]);

    return (
        <group>
            <Sphere
                args={[r - offset, 100, 100]}
                material={material}
                position={[0, r, 0]}
                rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            />
        </group>
    );
}
