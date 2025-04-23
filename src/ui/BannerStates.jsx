import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore.jsx";

export default function BannerStates() {
    const scale = useStore((state) => state.scale);
    const setScale = useStore((state) => state.setScale);

    const [selected, setSelected] = useState(useStore.getState().scale);
    const theme = useTheme();
    const bannerH = theme.bannerH; // "5vh" or any other value you want to use

    const btns = [
        {
            value: "xl",
            label: "World",
        },
        {
            value: "m",
            label: "Fieldwork",
        },
        {
            value: "xs",
            label: "Pavilion",
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
                    mb: bannerH,
                    backgroundColor: "whitesmoke",
                    border: "1px solid grey",
                    borderRadius: bannerH,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1,
                }}
            >
                {btns.map((btn, i) => (
                    <ToggleButton
                        key={i}
                        sx={{
                            borderRadius: bannerH,
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
            </Box>
        </>
    );
}
