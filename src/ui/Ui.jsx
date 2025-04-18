import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";

import { useStore } from "../store/useStore";

import ScrollPager from "./ScrollPager";
import BannerStates from "./BannerStates";
import Cursor from "./Cursor";

export default function Ui() {
    return (
        <>
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    position: "absolute",
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    zIndex: 10,
                    pointerEvents: "none",
                }}
            >
                <Cursor />
                <ScrollPager />
                <BannerStates />
            </Box>
        </>
    );
}
