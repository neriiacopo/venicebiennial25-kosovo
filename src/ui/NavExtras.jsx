import { Box, Button, IconButton, ToggleButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import HomeIcon from "@mui/icons-material/HomeOutlined";
import InfoIcon from "@mui/icons-material/QuestionMark";

export default function NavExtras() {
    const theme = useTheme();
    const bannerH = theme.bannerH;

    const btns = [
        {
            value: "about",
            icon: <InfoIcon />,
        },
        {
            value: "home",
            icon: <HomeIcon />,
        },
    ];

    function placeHolderFn() {
        alert(
            "now the website should react to the filter. Perhaps it navigates automatically to an open entries of the db. Should we consider nav buttons (prev - next)  ?"
        );
    }

    return (
        <>
            <Box
                sx={{
                    width: theme.navW,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    mr: bannerH,
                }}
            >
                {btns.map((btn, i) => (
                    <IconButton
                        key={i}
                        onClick={placeHolderFn}
                        size="small"
                        sx={{
                            m: 0.5,
                            borderRadius: theme.btnH,
                        }}
                    >
                        {btn.icon}
                    </IconButton>
                ))}
            </Box>
        </>
    );
}
