import { useEffect, useState } from "react";
import gsap from "gsap";

import Grid from "./GridArrow.jsx";
import Globe from "./Globe.jsx";
import UVMap from "./UVMap.jsx";

import { useStore } from "../store/useStore.jsx";

export default function SceneContent() {
    const scale = useStore((state) => state.scale); // get scale from store
    const globeR = 100;

    const [u, setU] = useState(0); // transition control

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
                // onStart: () => {
                //     useStore.setState({ cameraLock: true });
                // },
                // onComplete: () => {
                //     useStore.setState({ cameraLock: false });
                // },
            }
        );
    }, [scale]);

    return (
        <>
            <Grid
                u={u}
                r={globeR}
            />
            <UVMap
                u={u}
                r={globeR}
            />

            <Globe
                u={u}
                r={globeR}
            />

            <ambientLight />
            <pointLight position={[10, 10, 10]} />
        </>
    );
}
