import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";

import { useStore } from "../store/useStore.jsx";

export default function BannerStates() {
    const scale = useStore((state) => state.scale);
    const setScale = useStore((state) => state.setScale);

    const [selected, setSelected] = useState(useStore.getState().scale);
    const bH = "5vh";

    const btns = [
        {
            value: "xs",
            label: "Pavillion",
        },
        {
            value: "m",
            label: "Fieldwork",
        },
        {
            value: "xl",
            label: "World",
        },
    ];

    const handleChange = (event, newSelection) => {
        if (newSelection !== null) {
            setSelected(newSelection);
            setScale(newSelection);
        }
    };

    useEffect(() => {
        setSelected(scale);
    }, [scale]);

    return (
        <>
            <Box
                sx={{
                    mb: bH,
                    // width: "30vw",
                    // height: bH,
                    backgroundColor: "whitesmoke",
                    border: "1px solid grey",
                    backgroundBlendMode: "darken",
                    borderRadius: bH,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pointerEvents: "auto",
                    p: 1,
                }}
            >
                {btns.map((btn, i) => (
                    <ToggleButton
                        sx={{
                            borderRadius: bH,
                            px: 10,
                            ml: i === 0 ? 0 : 1,
                            mr: i === btns.length - 1 ? 0 : 1,
                        }}
                        onChange={handleChange}
                        size="small"
                        value={btn.value}
                        selected={selected === btn.value}
                    >
                        {btn.label}
                    </ToggleButton>
                ))}
                {/* <ToggleButtonGroup
                    value={selected}
                    exclusive
                    onChange={handleChange}
                    size="small"
                    sx={{
                        borderRadius: bH,
                        overflow: "hidden",
                        height: bH,
                        button: {
                            border: "1px solid grey",
                            borderRadius: bH,
                            flex: 1,
                            textTransform: "none",
                            px: 10,
                        },
                    }}
                >
                    <ToggleButton value="xl">World</ToggleButton>
                    <ToggleButton value="m">Archive</ToggleButton>
                    <ToggleButton value="xs">Pavillion</ToggleButton>
                </ToggleButtonGroup> */}
            </Box>
        </>
    );
}
