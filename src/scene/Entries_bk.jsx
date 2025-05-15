import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { getIndicesInUvDomain, seededShuffle } from "../utils.js";
import { useStore } from "../store/useStore.jsx";

import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

import GrayscaleSprite from "./GrayscaleSprites.jsx";

export default function Entries({
    data = [],
    scale,
    size = 10,
    color,
    uv = { x: [0.2, 0.8], y: [0.2, 0.8] },
}) {
    const seed = useMemo(() => Math.floor(Math.random() * 1000), []);
    const geometry = useStore((state) => state.uvmap);
    const spriteRefs = useRef([]);

    // Select vertex indices using UV domain
    const idx = useMemo(() => {
        if (!geometry || !data?.length) return;

        const indices = getIndicesInUvDomain(geometry, uv);
        const shuffled = seededShuffle(indices, seed);
        return shuffled.slice(0, data.length);
    }, [geometry?.uuid, data, seed, uv]);

    // Update sprite positions every frame to track morphing geometry
    useFrame(() => {
        if (!geometry || !idx?.length || !spriteRefs.current.length) return;

        const posAttr = geometry.attributes.position;

        for (let i = 0; i < idx.length; i++) {
            const index = idx[i];
            const sprite = spriteRefs.current[i];
            if (!sprite) continue;

            sprite.position.set(
                posAttr.getX(index),
                posAttr.getY(index),
                posAttr.getZ(index)
            );
        }
    });

    const materialRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Update uniform on hover
    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uGrayscale = hovered ? 0.0 : 1.0;
        }
    }, [hovered]);

    // Render sprites only when geometry and data are valid
    return (
        <>
            {geometry &&
                // activeScale === scale &&
                idx?.length === data.length &&
                data.map((obj, i) => (
                    <sprite
                        rotation={[Math.PI / 2, 0, 0]}
                        key={i}
                        ref={(ref) => (spriteRefs.current[i] = ref)}
                        scale={[size * (obj.img?.aspectRatio || 1), size, 1]}
                        onClick={(e) => {
                            e.stopPropagation();
                            useStore.setState({ selectedId: obj.id });
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            // e.object.material.color.set("rgba(255,255,255,1)"); // Change color on hover

                            useStore.setState({ imgHover: true });
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            // e.object.material.color.set(color); // Reset color on hover out

                            useStore.setState({ imgHover: false });
                        }}
                    >
                        <spriteMaterial
                            map={obj.img?.texture}
                            // color={color}
                            transparent
                            sizeAttenuation
                            depthTest={false}
                            depthWrite={false}
                        />
                    </sprite>
                ))}
        </>
    );
}
