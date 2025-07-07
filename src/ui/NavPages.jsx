import { Box, Button, ToggleButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";
import { useState, useEffect, use } from "react";

import ButtonL from "./ButtonL";

export default function NavPages() {
    const db = useStore((state) => state.db);
    const startNarrative = useStore((state) => state.startNarrative);
    const resetLanding = useStore((state) => state.resetLanding);
    const narratives = useStore((state) => state.narratives);
    const drop = useStore((state) => state.dropNarratives);
    const activeNarratives = useStore((state) => state.activeNarratives);

    const theme = useTheme();
    const bannerH = theme.bannerH;

    function toggleDrop() {
        useStore.setState({ dropNarratives: !drop });
        // setDrop(!drop);
        console.log("Toggle drop", drop);
    }

    function ButtonS({ label, onClick }) {
        return (
            <Typography
                sx={{
                    textTransform: "none",
                    textDecoration: "underline",
                    textDecorationThickness: "2px",
                    textAlign: "left",
                    m: 0,
                    pr: 2,
                    pointerEvents: "auto",
                    backgroundColor: "transparent",
                }}
                onClick={onClick}
                className="clickable"
            >
                {label}
            </Typography>
        );
    }

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 1000,

                    px: 8,
                    pr: 16,
                    pt: 8,
                    width: "33vw",
                    textAlign: "left",
                    textJustify: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    opacity: 1,
                    pointerEvents: "none",
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        width: "100%",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        color: theme.colors.black.main,
                    }}
                >
                    <ButtonS
                        label="About"
                        onClick={resetLanding}
                    />
                    <ButtonS
                        label="Discover"
                        onClick={toggleDrop}
                    />
                    <Box
                        sx={{
                            flexGrow: 1,
                            textAlign: "right",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "inline-block",
                                transition: "transform 0.3s",
                                transform: drop
                                    ? "rotate(-90deg)"
                                    : "rotate(0deg)",
                                // userSelect: "none",
                            }}
                            className="clickable"
                            onClick={toggleDrop}
                        >
                            ←
                        </Typography>
                    </Box>
                </Stack>
                {narratives.map((n, index) => {
                    return (
                        <ButtonL
                            key={index}
                            label={n}
                            onClick={() => startNarrative(n)}
                            drop={drop}
                            textAlign="left"
                            initialSelect={activeNarratives.includes(n)}
                        />
                    );
                })}
            </Box>
        </>
    );
}
