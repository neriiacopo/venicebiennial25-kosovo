import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Sphere } from "@react-three/drei";

import { latLonToXYZ } from "../utils.js";

import { useFrame, useLoader } from "@react-three/fiber";

import { useStore } from "../store/useStore.jsx";

export default function Globe({ u, offset = 0.1 }) {
    const r = useStore((state) => state.globe.radius);
    const texturePath = useStore((state) => state.globe.texture);
    const scale = useStore((state) => state.scale);

    const meshRef = useRef();

    const texture = useMemo(
        () => new THREE.TextureLoader().load(texturePath),
        [texturePath]
    );

    // const texture = useLoader(THREE.TextureLoader,texturePath) // <-- put your texture path here

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.time.value =
                state.clock.elapsedTime;
            meshRef.current.material.uniforms.uBlend.value = u * 2;
        }
    });

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    uTexture: { value: texture },
                    uBlend: { value: u }, // NEW: blending uniform
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
      uniform float time;
      uniform sampler2D uTexture;
      uniform float uBlend;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec4 texColor = texture2D(uTexture, vUv);

        float n1 = random(vUv * 10.0 + time * 0.5);
        float n2 = random(vUv * 30.0 - time * 0.2);
        float blendedNoise = n1 * n2;

        // Multiply texture color with noise
        vec3 textureTimesNoise = texColor.rgb * blendedNoise;

        // Now blend between "texture * noise" and "just noise" based on uBlend
        vec3 finalColor = mix(textureTimesNoise, vec3(blendedNoise), uBlend);

        gl_FragColor = vec4(finalColor, texColor.a);
      }
        
    `,
                transparent: true,
            }),
        [texture]
    );
    return (
        <>
            {scale == "xl" && (
                <Sphere
                    args={[r - offset, 100, 100]}
                    // scale={[1 + 1 * u, 1, 1 + 1 * u]}
                    scale={[1, 1, 1]}
                    position={[0, r, 0]}
                    material-transparent={true}
                    material-opacity={1 - u * 2}
                    // material-map={texture}
                    rotation={[Math.PI / 2, -Math.PI / 2, 0]}
                    ref={meshRef}
                    material={material}
                />
            )}
        </>
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
