import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { getIndicesInUvDomain, seededShuffle } from "../utils.js";
import { useStore } from "../store/useStore.jsx";

export default function Entries({
    data = [],
    scale,
    size = 10,
    color,
    uv = { x: [0.2, 0.7], y: [0.2, 0.7] },
    defaultPosition = null,
}) {
    const seed = useMemo(() => Math.floor(Math.random() * 1000), []);
    const geometry = useStore((state) => state.uvmap);
    const spriteRefs = useRef([]);
    const openEntry = useStore((state) => state.openEntry);
    console.log(data);

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

            if (data[i].position == null) {
                sprite.position.set(
                    posAttr.getX(index),
                    posAttr.getY(index),
                    posAttr.getZ(index)
                );
            } else {
                sprite.position.set(
                    data[i].position[0],
                    data[i].position[1],
                    data[i].position[2]
                );
            }
        }
    });

    const [hovereds, setHovereds] = useState([]);

    useEffect(() => {
        if (data?.length) {
            setHovereds(new Array(data.length).fill(false));
        }
    }, [data.length]);

    return (
        <>
            {geometry &&
                idx?.length === data.length &&
                data.map((obj, i) => (
                    <sprite
                        rotation={[Math.PI / 2, 0, 0]}
                        key={i}
                        ref={(ref) => (spriteRefs.current[i] = ref)}
                        scale={[size * (obj.img?.aspectRatio || 1), size, 1]}
                        onClick={(e) => {
                            e.stopPropagation();
                            openEntry(obj.id);
                        }}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            useStore.setState({ imgHover: true });
                            const newHovereds = [...hovereds];
                            newHovereds[i] = true;
                            setHovereds(newHovereds);
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            useStore.setState({ imgHover: false });
                            const newHovereds = [...hovereds];
                            newHovereds[i] = false;
                            setHovereds(newHovereds);
                        }}
                    >
                        <spriteMaterial
                            map={obj.img?.texture}
                            transparent
                            depthTest={false}
                            depthWrite={false}
                        />
                    </sprite>
                ))}
        </>
    );
}
