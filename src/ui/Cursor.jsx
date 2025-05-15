import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";

import { useStore } from "../store/useStore";

export default function Cursor() {
    const theme = useTheme();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hover, setHovering] = useState(false);
    const hoverClasses = useStore.getState().hoverClasses;
    const imgHover = useStore((state) => state.imgHover);
    const cameraLock = useStore((state) => state.cameraLock);

    useEffect(() => {
        const moveCursor = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        const onMouseOver = (e) => {
            const isClickable = e.target.closest(hoverClasses.join(", "));
            setHovering(!!isClickable);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", onMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", onMouseOver);
        };
    }, []);

    useEffect(() => {
        useStore.setState({ cameraLock: hover || imgHover });
    }, [hover, imgHover]);

    return (
        <div
            style={{
                position: "fixed",
                top: position.y,
                left: position.x,
                width: `${16 + (hover | imgHover) * 10}px`,
                height: `${16 + (hover | imgHover) * 10}px`,
                border: `1px solid ${
                    hover | imgHover ? "black" : "whitesmoke"
                }`,
                backgroundColor: hover | imgHover ? "whitesmoke" : "black",
                borderRadius: "50%",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                transition: "all 150ms ease, top 0ms, left 0ms",
            }}
        />
    );
}
