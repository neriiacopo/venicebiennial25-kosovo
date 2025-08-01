import { Box, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore.jsx";
import ButtonL from "./ButtonL";
import TextFx from "./TextFx.jsx";
import { glowTextFx } from "../utils.js";

export default function NavScales() {
    const landing = useStore((state) => state.landing);
    const scale = useStore((state) => state.scale);
    const setScale = useStore((state) => state.setScale);
    const closeEntry = useStore((state) => state.closeEntry);

    // const [selected, setSelected] = useState(useStore.getState().scale);
    const theme = useTheme();

    const btns = [
        { value: "xl", label: "World" },
        { value: "m", label: "Fieldwork" },
        { value: "xs", label: "Pavilion" },
    ];

    const handleChange = (newSelection) => {
        if (newSelection !== null) {
            // setSelected(newSelection);
            setScale(newSelection);
            closeEntry();
        }
    };

    // useEffect(() => {
    //     setSelected(scale);
    // }, [scale]);

    return (
        <Stack
            direction="row"
            spacing={4}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 1000,
                pb: 8,
                width: "100%",
                justifyContent: "center",
                opacity: !landing ? 1 : 0,
                pointerEvents: "none",
            }}
        >
            {btns.map((btn, i) => (
                <Box
                    key={btn.value}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <ButtonL
                        label={btn.label}
                        onClick={() => handleChange(btn.value)}
                        drop={!landing}
                        textAlign="center"
                        initialSelect={scale === btn.value}
                    />
                    {i < btns.length - 1 && (
                        <Typography
                            variant="h4"
                            sx={{
                                color: theme.colors.black.main,
                                pointerEvents: "none",
                                userSelect: "none",
                                fontWeight: 300,
                                opacity: 0.5,
                                fontFamily: theme.fonts.button,
                                filter: "blur(2px)",
                                textShadow: glowTextFx(
                                    "2px",
                                    theme.colors.grey.darker,
                                    "2px"
                                ),
                            }}
                        ></Typography>
                    )}
                </Box>
            ))}
        </Stack>
    );
}
