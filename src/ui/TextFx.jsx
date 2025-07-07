import { Typography, Box } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { createPortal } from "react-dom";
import { glowTextFx } from "../utils";

export default function TextFx({ label, textAlign = "center", drop = true }) {
    const theme = useTheme();
    const ref = useRef(null);
    const [coords, setCoords] = useState(null);

    // Sync position for background blur layer
    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
            });
        }
    }, []);

    const sharedS = {
        fontSize: "2rem",
        lineHeight: "2.5rem",
        textTransform: "uppercase",
        textAlign: textAlign,
        m: 0,
        color: theme.colors.black.main,
        fontFamily: theme.fonts.button,
    };

    const blurStyle = coords && {
        position: "absolute",
        top: coords.top,
        left: coords.left,
        width: coords.width,
        height: coords.height,
        opacity: drop ? 0.8 : 0,
        filter: "blur(2px)",
        textShadow: glowTextFx("2px", theme.colors.grey.darker, "2px"),
    };

    return (
        <>
            <Box
                ref={ref}
                sx={{
                    position: "relative",
                    display: "inline-block",
                }}
            >
                <Typography sx={{ ...sharedS }}>{label}</Typography>
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
