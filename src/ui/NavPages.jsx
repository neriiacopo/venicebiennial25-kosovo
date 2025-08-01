import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";

import ButtonL from "./ButtonL";

export default function NavPages() {
    const db = useStore((state) => state.db);
    const startNarrative = useStore((state) => state.startNarrative);
    const resetLanding = useStore((state) => state.resetLanding);
    const narratives = useStore((state) => state.narratives);
    const drop = useStore((state) => state.dropNarratives);
    const activeNarratives = useStore((state) => state.activeNarratives);
    const landing = useStore((state) => state.landing);

    const theme = useTheme();
    const bannerH = theme.bannerH;

    function toggleDrop() {
        if (landing) {
            useStore.setState({ dropNarratives: !drop, landing: false });
        } else {
            useStore.setState({ dropNarratives: !drop });
        }
    }

    function ButtonS({ label, onClick }) {
        return (
            <Typography
                sx={{
                    textTransform: "none",
                    textDecoration: "underline",
                    textDecorationThickness: "1px",
                    textAlign: "left",
                    m: 0,
                    pr: 2,
                    pointerEvents: "auto",
                    backgroundColor: "transparent",
                    fontSize: "1.05rem",
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
                    pt: 4,
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
                                    ? "rotate(0deg)"
                                    : "rotate(90deg)",

                                fontFeatureSettings: `"ss04" 1`,
                            }}
                            className="clickable"
                            onClick={toggleDrop}
                        >
                            v
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
