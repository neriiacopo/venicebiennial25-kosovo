import * as THREE from "three";
import { Sphere } from "@react-three/drei";
import { useMemo } from "react";

import { latLonToXYZ } from "../utils.js";

import { useStore } from "../store/useStore.jsx";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Globe({ u, offset = 0.1 }) {
    const r = useStore((state) => state.globe.radius);
    const texturePath = useStore((state) => state.globe.texture);

    const texture = useLoader(TextureLoader, texturePath);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uTexture: { value: texture },
                    uBlend: { value: 0.5 },
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

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);

          // Blend texture color with black
          vec3 finalColor = mix(texColor.rgb, vec3(0.0), uBlend);

          gl_FragColor = vec4(finalColor, texColor.a);
        }
      `,
                transparent: true,
            }),
        [texture]
    );

    return (
        <group opacity={1 - u * 2}>
            <Sphere
                args={[r - offset, 100, 100]}
                scale={[1, 1, 1]}
                position={[0, r, 0]}
                material={material}
                // material-color={"black"}
                // material-transparent={true}
                // material-opacity={1}
                // material-map={texture}
                rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            />
        </group>
    );
}
