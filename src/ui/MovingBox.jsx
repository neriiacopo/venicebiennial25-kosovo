import { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

import { useStore } from "../store/useStore";

const MovingBox = forwardRef(
    ({ content, pt = 0, zIndex = 2, scroll = true }, ref) => {
        const landing = useStore((state) => state.landing);
        const introY = useStore((state) => state.introY);
        const fxIntro = useStore((state) => state.fxIntro);

        const visibleP = 0;
        const invisibleP = 0;

        return (
            <Box
                ref={ref}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: `${pt}px`,
                    zIndex: landing ? zIndex : 0,
                    pb: `${invisibleP + visibleP}px`,
                    opacity: landing ? 1 : 0,
                    transform: scroll ? `translateY(-${introY}px)` : "none",
                    transition: `transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), zIndex 1s ease-in-out, opacity ${fxIntro.landing}s `,
                    justifyContent: "center",
                }}
            >
                {content}
            </Box>
        );
    }
);

export default MovingBox;
