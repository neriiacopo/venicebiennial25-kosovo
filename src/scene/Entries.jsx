import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getIndicesInUvDomain, seededShuffle } from "../utils.js";
import { useStore } from "../store/useStore.jsx";

export default function Entries({
    data = [],
    scale,
    size = 10,
    color,
    uv = { x: [0.2, 0.8], y: [0.2, 0.8] },
}) {
    const seed = useMemo(() => Math.floor(Math.random() * 1000), []);
    const geometry = useStore((state) => state.uvmap);
    const activeScale = useStore((state) => state.scale);
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

    // Render sprites only when geometry and data are valid
    return (
        <>
            {geometry &&
                // activeScale === scale &&
                idx?.length === data.length &&
                data.map((obj, i) => (
                    <sprite
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
