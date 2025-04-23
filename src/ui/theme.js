import { createTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";

const colors = {
    black: {
        main: "#111111",
        light: "#222222",
        darker: "#000000",
        contrastText: "#ffffff",
    },
    white: {
        main: "#f5f5f5",
        light: "#ffffff",
        darker: "#e0e0e0",
        contrastText: "#111111",
    },
    grey: {
        main: "#808080",
    },
};

const bannerH = "5vh";

// Main dims and colors
let theme = createTheme({
    modalEntryW: "50vw",
    btnH: "2.5vh",
    navW: "10vw",
    bannerH,
    typography: {
        fontFamily: "Work Sans",
    },
    colors,

    components: {
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    pointerEvents: "auto",
                    cursor: "none",
                    textTransform: "lowercase",
                    backgroundColor: colors.white.main,
                    color: colors.black.main,
                    border: "1px solid",
                    borderColor: colors.grey.main,

                    "&:hover": {
                        backgroundColor: colors.white.darker,
                    },
                    "&.Mui-selected": {
                        backgroundColor: colors.black.main,
                        color: colors.black.contrastText,
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: colors.black.light,
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
                    textTransform: "lowercase",
                    backgroundColor: colors.white.main,
                    color: colors.white.contrastText,
                    border: "1px solid",
                    borderColor: colors.grey.main,
                    "&:hover": {
                        backgroundColor: colors.white.darker,
                    },
                    "&.Mui-selected": {
                        backgroundColor: colors.black.main,
                        color: colors.black.contrastText,
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: colors.black.light,
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
                    width: "0.5em",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: colors.black.main,
                    // border: "#818181 0.5px solid",
                    borderRadius: "1em",
                    // marginTop: bannerH,
                    // marginBottom: bannerH,
                },

                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.white.main,
                    borderRadius: "1em",
                },

                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: colors.white.darker,
                },
            },
        },
    },
});

const activeClasses = Object.keys(theme.components);
useStore.setState({ hoverClasses: activeClasses.map((c) => `.${c}-root`) });

export default theme;
