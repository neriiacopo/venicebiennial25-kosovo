import { Box, IconButton, Typography } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";

import MarkdownPage from "./MarkdownPage";

import LeftIcon from "@mui/icons-material/ChevronLeft";
import RightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalEntry() {
    const theme = useTheme();
    const db = useStore((state) => state.db);
    const selectedId = useStore((state) => state.selectedId);
    const [page, setPage] = useState(undefined);
    const [narrativeIds, setNarrativeIds] = useState(undefined);

    const narratives = useStore((state) => state.narratives);

    const modalH =
        100 - Number(theme.bannerH.toString().replace("vh", "")) * 4 - 4;

    useEffect(() => {
        const selectedEntry = db.find((entry) => entry.id === selectedId);

        if (!selectedEntry || selectedId == null) {
            useStore.setState({ activeNarratives: [] });
            setPage(undefined);
            return;
        }

        const activeNarratives = narratives.filter(
            (n) => selectedEntry[n] != null
        );

        const relevantIds = db
            .map((d) =>
                activeNarratives.some((n) => d[n] != null) ? d.id : undefined
            )
            .filter((id) => id !== undefined);

        setNarrativeIds(relevantIds);
        setPage(selectedEntry);

        useStore.setState({ activeNarratives: activeNarratives[0] });
    }, [selectedId, db]);

    useEffect(() => {
        if (page) {
            useStore.setState({ cameraLock: true });
        } else {
            useStore.setState({ cameraLock: false });
        }
    }, [page]);

    // Nav keys functions
    useEffect(() => {
        function handleKeyDown(event) {
            if (!page) return;

            switch (event.key) {
                case "Escape":
                    useStore.setState({ selectedId: null });
                    useStore.setState({ activeNarratives: [] });
                    break;
                case "ArrowLeft":
                    changeEntry(-1);
                    break;
                case "ArrowRight":
                    changeEntry(1);
                    break;
                default:
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [page, selectedId, narrativeIds]);

    function changeEntry(step) {
        const currentIndex = narrativeIds.indexOf(selectedId);
        const newIndex = currentIndex + step;
        if (newIndex >= 0 && newIndex < narrativeIds.length) {
            useStore.setState({ selectedId: narrativeIds[newIndex] });
        }
    }

    return (
        <>
            {page && (
                <Box
                    sx={{
                        width: theme.modalEntryW,
                        mb: theme.bannerH,
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        height: `${modalH}vh`,
                    }}
                >
                    <IconButton
                        sx={{
                            mr: theme.bannerH,
                            borderRadius: theme.btnH,
                            height: theme.bannerH,
                            width: theme.bannerH,
                        }}
                        onClick={() => changeEntry(-1)}
                        disabled={narrativeIds.indexOf(selectedId) == 0}
                    >
                        <LeftIcon />
                    </IconButton>

                    {/* Page  ------------------------------------------------ */}
                    <Box
                        sx={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "row",
                            height: "100%",
                            maxHeight: "100%",
                            position: "relative",
                            border: "1px solid",
                            borderColor: theme.colors.grey.main,
                        }}
                    >
                        {/* Closing icon .................................... */}
                        <IconButton
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                m: theme.btnH,
                                borderRadius: theme.btnH,
                                height: theme.bannerH,
                                width: theme.bannerH,
                                zIndex: 100,
                            }}
                            onClick={() => {
                                useStore.setState({ selectedId: null });
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {page.video && (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "black", // better for videos
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <video
                                    src={page.video.path}
                                    controls
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        pointerEvents: "auto",
                                        cursor: "none",
                                    }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </Box>
                        )}

                        {page.img && !page.video && (
                            <>
                                <Box
                                    sx={{
                                        backgroundColor:
                                            theme.colors.white.main,
                                        borderRight: "1px solid",
                                        borderColor: theme.colors.grey.main,
                                        height: "100%",
                                        width: "50%",
                                    }}
                                >
                                    <img
                                        src={page.img.path}
                                        alt={page.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        backgroundColor:
                                            theme.colors.black.main,
                                        width: "50%",
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flex: 1,
                                            overflowY: "auto",
                                            p: 4,
                                            color: theme.colors.black
                                                .contrastText,
                                            pointerEvents: "auto",
                                        }}
                                    >
                                        <MarkdownPage
                                            title={page.title}
                                            path={`data/mds/${page.text}.md`}
                                        />
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>

                    <IconButton
                        sx={{
                            ml: theme.bannerH,
                            borderRadius: theme.btnH,
                            height: theme.bannerH,
                            width: theme.bannerH,
                        }}
                        onClick={() => changeEntry(+1)}
                        disabled={
                            narrativeIds.indexOf(selectedId) ==
                            narrativeIds.length - 1
                        }
                    >
                        <RightIcon />
                    </IconButton>
                </Box>
            )}
        </>
    );
}
