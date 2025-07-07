import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";

import { useStore } from "../store/useStore";

import { glowTextFx } from "../utils";

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

    // useEffect(() => {
    //     useStore.setState({ cameraLock: hover || imgHover });
    // }, [hover, imgHover]);

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: position.y,
                    left: position.x,
                    width: `${16 + (hover | imgHover) * 10}px`,
                    height: `${16 + (hover | imgHover) * 10}px`,
                    border: `${hover | imgHover ? "2px" : "1px"} black solid `,
                    backgroundColor: hover | imgHover ? "transparent" : "black",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    // opacity: hover | imgHover ? 0.5 : 1,
                    overflow: "visible",
                    boxShadow:
                        hover | imgHover
                            ? glowTextFx("2px", theme.colors.black.main, "5px")
                            : "none",
                    // filter: hover | imgHover ? "blur(1px)" : "blur(0px)",
                    // backdropFilter: "blur(2px)",
                    // filter: hover | imgHover ? "blur(20px)" : "none",
                    transition: "all 150ms ease, top 0ms, left 0ms",
                    opacity: 0.2,
                }}
            />
            <div
                style={{
                    position: "fixed",
                    top: position.y,
                    left: position.x,
                    width: `${16 + (hover | imgHover) * 10}px`,
                    height: `${16 + (hover | imgHover) * 10}px`,
                    border: `${hover | imgHover ? "2px" : "1px"} black solid `,
                    backgroundColor: hover | imgHover ? "transparent" : "black",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    // opacity: hover | imgHover ? 0.5 : 1,
                    overflow: "visible",
                    // boxShadow:
                    //     hover | imgHover
                    //         ? glowTextFx("1px", theme.colors.black.main, "2px")
                    //         : "none",
                    // filter: hover | imgHover ? "blur(1px)" : "blur(0px)",
                    // backdropFilter: "blur(2px)",
                    // filter: hover | imgHover ? "blur(10px)" : "none",
                    transition: "all 150ms ease, top 0ms, left 0ms",
                }}
            />
        </>
    );
}
