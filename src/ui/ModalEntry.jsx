import { Box, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useStore } from "../store/useStore";

import MarkdownPage from "./MarkdownPage";

export default function ModalEntry() {
    const theme = useTheme();
    const db = useStore((state) => state.db);
    const selectedId = useStore((state) => state.selectedId);
    const closeEntry = useStore((state) => state.closeEntry);
    const narrativeIds = useStore((state) => state.narrativeIds);
    const noisePattern = useStore((state) => state.noisePattern);

    const [entry, setEntry] = useState(null);
    const modalHeight = "80vh";
    const currentIndex = narrativeIds.indexOf(selectedId);

    const contentRef = useRef(null);

    useEffect(() => {
        const found = db.find((e) => e.id === selectedId);
        setEntry(found || null);
    }, [selectedId, db]);

    useEffect(() => {
        useStore.setState({ cameraLock: !!entry });
    }, [entry]);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [selectedId]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!entry) return;
            if (e.key === "Escape") closeEntry();
            else if (e.key === "ArrowLeft") navigateEntry(-1);
            else if (e.key === "ArrowRight") navigateEntry(1);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [entry, currentIndex, narrativeIds]);

    const navigateEntry = (step) => {
        const nextIndex = currentIndex + step;
        if (nextIndex >= 0 && nextIndex < narrativeIds.length) {
            useStore.setState({ selectedId: narrativeIds[nextIndex] });
        }
    };

    const showImage = entry?.img && !entry?.video;
    const showVideo = !!entry?.video;

    return (
        <>
            {entry && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        width: "100vw",
                        height: "100vh",
                        pointerEvents: "auto",
                    }}
                    onClick={() => {
                        console.log("sss");
                    }}
                ></Box>
            )}
            <Box
                key={selectedId} // Force re-animation on entry change
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    ml: "33.333vw",
                    width: "66.666vw",
                    display: "flex",
                    alignItems: "center",
                    height: modalHeight,
                    pointerEvents: entry ? "auto" : "none",
                    opacity: entry ? 1 : 0,
                    transform: entry ? "translateY(0%)" : "translateY(-5%)",
                    transition: "all .2s ease-in-out",
                }}
            >
                {entry && (
                    <Box
                        sx={{
                            display: "flex",
                            flex: 1,
                            height: "100%",
                            border: "1px solid",
                            borderColor: theme.colors.grey.main,
                            position: "relative",
                        }}
                    >
                        {showVideo && (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundImage: `url(${noisePattern})`,
                                    backgroundSize: "cover",
                                    backgroundColor: theme.colors.grey.darker,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <video
                                    src={entry.video.path}
                                    controls
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        pointerEvents: "auto",
                                        cursor: "none",
                                    }}
                                />
                            </Box>
                        )}

                        {showImage && (
                            <>
                                <Box
                                    sx={{
                                        width: "50%",
                                        minWidth: "50%",
                                        borderRight: "1px solid",
                                        borderColor: theme.colors.grey.main,
                                        backgroundImage: `url(${noisePattern})`,
                                        backgroundColor:
                                            theme.colors.grey.darker,
                                        backgroundSize: "cover",
                                        overflow: "hidden",
                                    }}
                                >
                                    <BlurryImg
                                        src={entry.img.path}
                                        alt={entry.title}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        width: "50%",
                                        minWidth: "50%",
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        backgroundImage: `url(${noisePattern})`,
                                        backgroundColor:
                                            theme.colors.grey.darker,
                                        backgroundSize: "cover",
                                        pb: 2,
                                    }}
                                >
                                    <NavModal
                                        canGoBack={currentIndex > 0}
                                        canGoNext={
                                            currentIndex <
                                            narrativeIds.length - 1
                                        }
                                        onBack={() => navigateEntry(-1)}
                                        onNext={() => navigateEntry(1)}
                                        onClose={closeEntry}
                                    />
                                    <Box
                                        ref={contentRef}
                                        sx={{
                                            flex: 1,
                                            overflowY: "auto",
                                            p: 4,
                                            color: theme.colors.white
                                                .contrastText,
                                            maskImage:
                                                "linear-gradient(to top, black 75%, rgb(0,0,0,0.1) 90%)",
                                        }}
                                    >
                                        <MarkdownPage
                                            key={selectedId} // Force Markdown reset
                                            title={entry.title}
                                            path={`data/mds/${entry.text}.md`}
                                        />
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </Box>
        </>
    );
}

// Blurry Image component
function BlurryImg({ src, alt }) {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        setLoaded(false);
        const timeout = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(timeout);
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: loaded
                    ? "blur(0px) grayscale(0)"
                    : "blur(10px) grayscale(0.2)",
                transition: "filter 1s, opacity .3s",
            }}
        />
    );
}

// Nav Button
function NavBtn({ label, onClick, disabled }) {
    const theme = useTheme();
    return (
        <Box
            onClick={!disabled ? onClick : undefined}
            className="clickable"
            sx={{ px: 4, pointerEvents: disabled ? "none" : "auto" }}
        >
            <Typography
                sx={{
                    fontFamily: theme.fonts.navButton,
                    fontWeight: 400,
                    filter: disabled ? "blur(2px)" : "none",
                    opacity: disabled ? 0.7 : 1,
                    transition: "filter .6s, text-shadow .6s, opacity .6s",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

// Navigation Modal
function NavModal({ canGoBack, canGoNext, onBack, onNext, onClose }) {
    return (
        <Box
            sx={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                p: 4,
                pb: 2,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 1000,
            }}
        >
            <NavBtn
                label="p←evious"
                onClick={onBack}
                disabled={!canGoBack}
            />
            <NavBtn
                label="nex→"
                onClick={onNext}
                disabled={!canGoNext}
            />
            <Box sx={{ position: "absolute", right: 0 }}>
                <NavBtn
                    label="clOse"
                    onClick={onClose}
                    disabled={false}
                />
            </Box>
        </Box>
    );
}
