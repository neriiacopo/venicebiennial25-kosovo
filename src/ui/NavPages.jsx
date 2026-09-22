import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";
import { useLoadingStore } from "../store/loadingStore";

import ButtonL from "./ButtonL";

export default function NavPages() {
    const db = useStore((state) => state.db);
    const startNarrative = useStore((state) => state.startNarrative);
    const resetLanding = useStore((state) => state.resetLanding);
    const narratives = useStore((state) => state.narratives);
    const drop = useStore((state) => state.dropNarratives);
    const activeNarratives = useStore((state) => state.activeNarratives);
    const landing = useStore((state) => state.landing);
    const dataReady = useStore((state) => state.dataReady);
    const dataProgress = useLoadingStore((state) => state.dataProgress);

    const theme = useTheme();
    const bannerH = theme.bannerH;

    function toggleDrop() {
        // Don't reveal the (still empty) 3D scene before the structural
        // data has loaded — see dataReady in useStore.jsx.
        if (!dataReady) return;

        if (landing) {
            useStore.setState({ dropNarratives: !drop, landing: false });
        } else {
            useStore.setState({ dropNarratives: !drop });
        }
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
                        label={
                            dataReady
                                ? "Discover"
                                : `Loading ${Math.round(dataProgress)}%`
                        }
                        onClick={toggleDrop}
                        disabled={!dataReady}
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

            <PastEditionsBox />
        </>
    );
}

function ButtonS({ label, onClick = null, clean = false, disabled = false }) {
    return (
        <Typography
            sx={{
                textTransform: "none",
                textDecoration: clean || disabled ? "none" : "underline",
                textDecorationThickness: "1px",
                textAlign: "left",
                m: 0,
                pr: clean ? 0 : 2,
                pointerEvents: disabled ? "none" : "auto",
                opacity: disabled ? 0.5 : 1,
                backgroundColor: "transparent",
                fontSize: "1.05rem",
                cursor: disabled ? "default" : undefined,
            }}
            onClick={disabled ? undefined : onClick}
            className={disabled ? "" : "clickable"}
        >
            {label}
        </Typography>
    );
}

///// EXTRA
import StylizedCharacters from "./StylizedCharacters";

function PastEditionsBox({ w = "15%" }) {
    const landing = useStore((state) => state.landing);
    const theme = useTheme();
    const fxIntro = useStore((state) => state.fxIntro);

    const opacity = landing ? 1 : 0;
    const links = [
        {
            id: 0,
            label: "2019",
            url: "2019.pavilionofkosovo.com",
        },
        {
            id: 1,
            label: "2022",
            url: "2022.pavilionofkosovo.com",
        },
        {
            id: 2,
            label: "2023",
            url: "2023.pavilionofkosovo.com",
        },
        {
            id: 3,
            label: "2024",
            url: "2024.pavilionofkosovo.com",
        },
    ];

    return (
        <Box
            sx={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                textAlign: "right",
                mt: 16,
                mb: 2,
                width: w,
                top: "5vw",
                right: 0,
                p: 4,
                opacity: opacity,
                transition: `opacity ${fxIntro.landing}s ease-in-out`,

                zIndex: 1000,
            }}
        >
            <ButtonS
                label="Previous Editions"
                onClick={() => {}}
                clean={true}
            />
            <Stack
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    gap: 1,
                }}
            >
                {links.map((n, index) => {
                    return (
                        <Typography
                            key={index}
                            variant="h6"
                            component="a"
                            href={"https://" + n.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                // display: "block",
                                textDecoration: "underline",
                                color: "inherit",

                                cursor: "none",
                            }}
                            onClick={() => {}}
                            className="clickable"
                        >
                            <StylizedCharacters
                                label={n.label}
                                percentage={0.5}
                                seed={233}
                            />
                        </Typography>
                    );
                })}
            </Stack>
        </Box>
    );
}
