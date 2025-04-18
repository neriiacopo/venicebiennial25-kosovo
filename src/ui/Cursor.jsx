import { useEffect, useState } from "react";

import { useStore } from "../store/useStore";

export default function Cursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hover, setHovering] = useState(false);
    const hoverClasses = useStore.getState().hoverClasses;

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

    return (
        // <div
        //     style={{
        //         position: "fixed",
        //         top: position.y,
        //         left: position.x,
        //         width: `${16 + hover * 10}px`,
        //         height: `${16 + hover * 10}px`,
        //         backdropFilter: "invert(1)",
        //         borderRadius: "50%",
        //         pointerEvents: "none",
        //         transform: "translate(-50%, -50%)",
        //         zIndex: 9999,
        //         transition: "all 150ms ease, top 0ms, left 0ms",
        //     }}
        // />
        <div
            style={{
                position: "fixed",
                top: position.y,
                left: position.x,
                width: `${16 + hover * 10}px`,
                height: `${16 + hover * 10}px`,
                border: `1px solid ${hover ? "black" : "whitesmoke"}`,
                backgroundColor: !hover ? "black" : "whitesmoke",
                borderRadius: "50%",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                transition: "all 150ms ease, top 0ms, left 0ms",
            }}
        />
    );
}
