import { createTheme } from "@mui/material/styles";

import { glowTextFx } from "../utils";

import { useStore } from "../store/useStore";

const fonts = {
    p: "ABCMonumentGrotesk-Cue-7,Arial, sans-serif",
    title: "ABCMonumentGrotesk-Cue-8,Arial, sans-serif",
    button: "ABCMonumentGrotesk-Cue-9,Arial, sans-serif",
    navButton: "ABCMonumentGrotesk-Cue-7,Arial, sans-serif",
};

const colors = {
    black: {
        main: "#111111",
        light: "#222222",
        darker: "#000000",
        contrastText: "#ffffff",
    },
    white: {
        main: "#f5f5f5",
        lightest: "#ffffff",
        light: "#f2f2f2",
        darker: "#e0e0e0",
        contrastText: "#111111",
    },
    grey: {
        lightest: "#f2f2f2",
        light: "#999999",
        main: "#808080",
        darker: "#666666",
        darkest: "#333333",
    },
};

const bannerH = "5vh";
const xM = "2.5vw";

// Main dims and colors
let theme = createTheme({
    fonts,
    xM,
    modalEntryW: "50vw",
    btnH: "2.5vh",
    navW: "10vw",
    bannerH,
    typography: {
        fontFamily: fonts.p,
    },
    colors,

    components: {
        clickable: {},
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textShadow: glowTextFx("2px", colors.grey.light),
                    p: 0,
                    m: 0,
                    fontSize: "2rem",
                    pointerEvents: "auto",
                    cursor: "none",
                    textTransform: "uppercase",
                    color: colors.black.main,
                    border: "none",
                    backgroundColor: "transparent",
                    // opacity: 0.5,

                    "&:hover": {
                        backgroundColor: "transparent",
                        // textShadow: glowTextFx("5px", colors.grey.light),
                    },
                    "&.Mui-selected": {
                        // color: colors.black.main,
                        opacity: 1,
                    },
                    "&.Mui-selected:hover": {
                        // textShadow: glowTextFx("5px", colors.grey.light),
                    },
                },
            },

            defaultProps: {
                disableRipple: true,
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    pointerEvents: "auto",
                    cursor: "none",
                    textTransform: "uppercase",
                    color: colors.black.main,
                    border: "none",
                    backgroundColor: "transparent",
                    // opacity: 0.5,

                    "&:hover": {
                        backgroundColor: "transparent",
                        // textShadow: glowTextFx("5px", colors.grey.light),
                    },
                    "&.Mui-selected": {
                        // color: colors.black.main,
                        opacity: 1,
                    },
                    "&.Mui-selected:hover": {
                        // textShadow: glowTextFx("5px", colors.grey.light),
                    },
                },
            },
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    pointerEvents: "auto",
                    cursor: "none",
                    backgroundColor: colors.black.main,
                    color: colors.white.main,
                    border: "1px solid",
                    borderColor: colors.grey.main,

                    "&:hover": {
                        backgroundColor: colors.black.light,
                    },
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fontSize: "1.25rem",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "0.3em",
                    overflow: "visible",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: colors.black.main,
                    // borderRadius: "1em",
                    visibility: "hidden",
                },

                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.black.main,

                    visibility: "hidden",
                    // borderRadius: "1em",
                },

                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: colors.black.darker,
                },
            },
        },
    },
});

const activeClasses = Object.keys(theme.components);
const hoverClasses = activeClasses.map((c) => `.${c}-root`);

hoverClasses.push(".clickable");
useStore.setState({ hoverClasses });

export default theme;
