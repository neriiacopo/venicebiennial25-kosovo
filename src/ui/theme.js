import { createTheme } from "@mui/material/styles";

// Main dims and colors
let theme = createTheme({
    typography: {
        fontFamily: "Work Sans",
    },

    components: {
        // Target all ToggleButton components
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    cursor: "none",
                    textTransform: "lowercase",
                    backgroundColor: "whitesmoke", // light gray/white background
                    color: "black",
                    px: "10",
                    border: "1px solid grey",
                    "&:hover": {
                        backgroundColor: "#e0e0e0",
                    },
                    "&.Mui-selected": {
                        backgroundColor: "black",
                        color: "white",
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "#222222",
                    },
                },
            },

            defaultProps: {
                disableRipple: true, // optional: removes ripple effect
            },
        },
    },
});

export default theme;
