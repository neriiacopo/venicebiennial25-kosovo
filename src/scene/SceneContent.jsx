import { useEffect, useState, useRef, Suspense } from "react";
import { AsciiRenderer } from "@react-three/drei";
import gsap from "gsap";

import Grid from "./GridArrow.jsx";
import Globe from "./Globe.jsx";
import UVMap from "./UVMap.jsx";
import Entries from "./Entries.jsx";
import Trail from "./Trail.jsx";
import DevControllers from "./DevControllers.jsx";

import { useStore } from "../store/useStore.jsx";
import loadAppData from "../loading/loadAppData.js";
import loadData from "../loading/loadAppData.js";

export default function SceneContent() {
    useEffect(() => {
        loadData();
    }, []);

    const scale = useStore((state) => state.scale);
    const globe = useStore((state) => state.globe); // globe or map

    const db = useStore((state) => state.db);
    const trails = useStore((state) => state.trails);
    const scales = useStore((state) => state.scales);

    const [u, setU] = useState(0.4); // transition control
    const scaleFactors = useRef({ values: [0, 0, 0] });

    // Transitions based on u
    useEffect(() => {
        const targetU = scale === "xl" ? 0 : scale === "m" ? 0.5 : 1;
        gsap.to(
            { u },
            {
                u: targetU,
                duration: 2,
                ease: "power3.out",
                onUpdate: function () {
                    setU(this.targets()[0].u);
                },
            }
        );
        gsap.to(scaleFactors.current.values, {
            ...scales.reduce((acc, s, i) => {
                acc[i] = s === scale ? 1 : 0;
                return acc;
            }, {}),
            duration: 0.3,
            ease: "power2.in",
        });
    }, [scale]);

    return (
        <>
            {/* <DevControllers /> */}
            <Grid u={u} />
            <UVMap u={u} />
            <Globe u={u} />

            {db?.length &&
                scale == "xl" &&
                trails &&
                trails.map((bird, i) => {
                    const active = ["Sharri", "Pashtrik"].includes(bird.name);
                    return (
                        <Trail
                            key={i}
                            data={bird.positions}
                            name={bird.name}
                            thickness={active ? 2 : 1}
                            dashed={!active}
                        />
                    );
                })}

            {db?.length &&
                scales.map((scale, i) => (
                    <Entries
                        key={i}
                        data={db.filter((d) => d.section === scale)}
                        scale={scale}
                        color={["orange", "red", "yellow"][i]}
                        uv={
                            [
                                { x: [0.3, 0.7], y: [0.3, 0.7] },
                                { x: [0.3, 0.7], y: [0.2, 0.8] },
                                { x: [0.1, 0.9], y: [0.35, 0.55] },
                            ][i]
                        }
                        size={[20, 20, 20][i] * scaleFactors.current.values[i]}
                    />
                ))}

            <ambientLight />
            <pointLight position={[10, 10, 10]} />
        </>
    );
}
