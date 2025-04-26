import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";

import PageScroller from "./PageScroller";
import BannerStates from "./BannerStates";
import Cursor from "./Cursor";
import NavFilters from "./NavFilters";
import NavExtras from "./NavExtras";
import ModalEntry from "./ModalEntry";

export default function Ui() {
    const theme = useTheme();
    const fadeRef = useRef(null);
    const selectedId = useStore((state) => state.selectedId);

    return (
        <>
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    position: "absolute",
                    width: "100vw",
                    height: "100vh",
                    maxHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    zIndex: 10,
                    pointerEvents: "none",
                }}
            >
                {/* Extras */}
                <Cursor />
                <PageScroller />

                {/* Main */}
                <Box
                    sx={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        mt: theme.bannerH,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        pointerEvents: "none",
                    }}
                >
                    <NavFilters />
                    <ModalEntry />
                    <NavExtras />
                </Box>

                {/* Bottom  */}
                <BannerStates />
            </Box>

            {/* Faded background for modal */}
            <Box
                ref={fadeRef}
                onClick={() => useStore.setState({ selectedId: null })}
                sx={{
                    top: 0,
                    left: 0,
                    position: "absolute",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 1,
                    pointerEvents: !selectedId != null ? "none" : "auto",
                    opacity: selectedId != null ? 0.8 : 0,
                    backgroundColor: theme.colors.white.main,
                    transition: "opacity 0.5s ease-in-out",
                }}
            />
        </>
    );
}
