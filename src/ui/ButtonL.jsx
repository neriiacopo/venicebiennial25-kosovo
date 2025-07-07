import { Typography, Box } from "@mui/material";
import { useState, useRef, useEffect, use } from "react";
import { useTheme } from "@mui/material/styles";
import { createPortal } from "react-dom";

import { glowTextFx } from "../utils";

export default function ButtonL({
    label,
    onClick,
    drop = true,
    textAlign = "left",
    initialSelect = false,
}) {
    const theme = useTheme();
    const [selected, setSelected] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);
    const [coords, setCoords] = useState(null);

    const animS = 0.2;

    useEffect(() => {
        if (initialSelect != undefined) {
            setSelected(initialSelect);
        }
    }, [initialSelect]);

    function handleClick() {
        setSelected(!selected);
        onClick();
    }

    // Sync position of blurred layer with ref
    useEffect(() => {
        if (ref.current) {
            setTimeout(() => {
                const rect = ref.current.getBoundingClientRect();
                setCoords({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height,
                });
            }, animS * 1000);
        }
    }, [drop]);

    const sharedS = {
        fontSize: "2rem",
        lineHeight: "2.5rem",
        textTransform: "uppercase",
        textAlign: textAlign,
        // backgroundColor: "blue",
        m: 0,
        color: theme.colors.black.main,
        transition: `all ${animS}s ease-in-out`,
        pointerEvents: drop ? "auto" : "none",
        fontFamily: theme.fonts.button,
    };

    const frontS = {
        fontWeight: selected || hovered ? 400 : 400,

        pointerEvents: drop ? "auto" : "none",
        position: "relative",
        zIndex: 100,

        opacity: selected || hovered ? 1 : 0.05,
        mixBlendMode: "difference",
    };

    const blurStyle = coords && {
        position: "absolute",
        top: coords.top,
        left: coords.left,
        width: coords.width,
        height: coords.height,
        transform: drop ? "translateY(0%)" : "translateY(-20%)",
        // fontWeight: selected || hovered ? 400 : 700,
        filter: drop && !(selected || hovered) ? "blur(2px)" : "blur(1px)",
        // zIndex: 1000,
        // opacity: drop && !(selected || hovered) ? 0.8 : 0,
        opacity: drop ? 0.8 : 0,
        textShadow:
            drop && !(selected || hovered)
                ? glowTextFx("2px", theme.colors.grey.darker, "2px")
                : glowTextFx("0.1px", theme.colors.white.main, "2px"),
    };

    return (
        <>
            <Box
                ref={ref}
                sx={{
                    position: "relative",
                    display: "inline-block",
                    overflow: "visible",

                    opacity: drop ? 1 : 0,
                    transition: "opacity .3s, transform .2s, filter .2s",
                }}
            >
                {/* Foreground interactive text */}
                <Typography
                    sx={{
                        ...sharedS,
                        ...frontS,
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleClick}
                    className="clickable"
                >
                    {label}
                </Typography>
            </Box>

            {/* Blurred background portal */}
            {coords &&
                createPortal(
                    <Typography
                        sx={{
                            ...sharedS,
                            ...blurStyle,
                        }}
                    >
                        {label}
                    </Typography>,
                    document.getElementById("blurLayer")
                )}
        </>
    );
}
