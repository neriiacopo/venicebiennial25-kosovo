import ReactMarkdown from "react-markdown";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import MovingBox from "./MovingBox";
import { glowTextFx } from "../utils";

import { useTheme } from "@mui/material/styles";
import { useStore } from "../store/useStore";

export default function Landing({}) {
    const landing = useStore((state) => state.landing);
    const fxIntro = useStore((state) => state.fxIntro);

    const ratios = { credits: "33%", intro: "52%", logo: "15%" };

    const fadeRef = useRef(null);
    const longerDivRef = useRef(null);

    const visibleP = 0; // double check
    const invisibleP = 0; // bottom p for fading

    useEffect(() => {
        if (longerDivRef.current) {
            const handleChildrenLoaded = () => {
                if (longerDivRef.current) {
                    const totalH = longerDivRef.current.scrollHeight;
                    useStore.setState({ introH: totalH - invisibleP });
                }
            };

            // MutationObserver to detect children changes
            const observer = new MutationObserver(handleChildrenLoaded);
            observer.observe(longerDivRef.current, {
                childList: true,
                subtree: true,
            });

            // Initial trigger in case children are already loaded
            handleChildrenLoaded();

            return () => observer.disconnect();
        }
    }, []);

    return (
        <>
            <BiennalLogo
                w={ratios.logo}
                opacity={landing ? 1 : 0}
            />
            <MovingBox
                content={<Title />}
                pt={0}
                zIndex={-2}
            />
            <MovingBox
                content={
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            mt: "25vh",
                            pb: ` ${window.innerHeight * 0.5}px`,
                            textAlign: "left",
                        }}
                    >
                        <Box
                            sx={{
                                width: ratios.credits,
                                p: 8,
                                py: 0,
                            }}
                        >
                            <Credits path={"./data/mds/landing/credits.md"} />
                        </Box>
                        <Box sx={{ width: ratios.intro }}>
                            <Intro path={"./data/mds/landing/intro.md"} />
                        </Box>
                    </Box>
                }
                pt={window.innerHeight}
                zIndex={100}
                ref={longerDivRef}
            />
        </>
    );
}

function Title() {
    const theme = useTheme();
    const blurTitle = useStore((state) => state.blurTitle);

    const noisy = {
        filter: ` blur(${blurTitle ? 1.5 : 5}px)`,
        opacity: blurTitle ? 1 : 0,
        transition: "opacity 0.1s ease-in-out, filter 1s ease-in-out",
        fontFamily: theme.fonts.title,
    };

    const content = [
        {
            text: (
                <>
                    Pavilion of the Republic of Kosovo <br />
                    at the 19th International Architecture Exhibition <br />
                    La Biennale di Venezia
                </>
            ),
            glow: "2px",
            variant: "h4",
            mb: 4,
        },
        {
            text: <>Erzë Dinarama</>,
            glow: "3px",
            variant: "h2",
        },
        {
            text: (
                <>
                    EMERGING <br /> Lulebora nuk çel më <br />
                    ASSEMBLAGES
                </>
            ),
            glow: "3px",
            variant: "h2",
        },
        {
            text: (
                <>
                    10.05 – 24.11 <br />
                    Arsenale, Sestiere Castello, <br />
                    Campo della Tana 2169/F, 30122 Venice, Italy
                </>
            ),
            glow: "2px",
            variant: "h4",
            mb: 4,
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                py: 4,
                height: "100vh",
                width: "50%",
                textAlign: "center",

                color: theme.colors.grey.darkest,
            }}
        >
            {content.map((item, index) => (
                <Typography
                    key={index}
                    variant={item.variant}
                    sx={{
                        mb: item.mb || 0,
                        textShadow: blurTitle
                            ? glowTextFx(
                                  item.glow,
                                  theme.colors.grey.darker
                                  //   item.glow
                              )
                            : "none",
                        ...noisy,
                    }}
                >
                    {item.text}
                </Typography>
            ))}
        </Box>
    );
}

function TitleImg() {
    const theme = useTheme();
    const blurTitle = useStore((state) => state.blurTitle);

    const paths = [
        "./outlined_2_desktop_header.svg",
        "./outlined_2_desktop_title.svg",
        "./outlined_2_desktop_footer.svg",
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                py: 4,
                height: "100vh",
                width: "50%",
                textAlign: "center",

                color: theme.colors.grey.darkest,
            }}
        >
            {paths.map((src, idx) => (
                <img
                    key={idx}
                    src={src}
                    style={{ width: "100%", height: "auto", marginBottom: 16 }}
                />
            ))}
        </Box>
    );
}

function Intro({ path }) {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch(path)
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);

    return (
        <ReactMarkdown
            components={{
                p: ({ node, ...props }) => (
                    <Typography
                        variant="h4"
                        {...props}
                        sx={{ m: "1em 0", mt: 0 }}
                    />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

function BiennalLogo({ w, opacity }) {
    const fxIntro = useStore((state) => state.fxIntro);
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: w,
                maxWidth: w,
                height: "auto",
                maxHeight: 100,
                zIndex: 1000,
                textAlign: "right",
                opacity: opacity,
                pointerEvents: "none",

                p: 4,
                mixBlendMode: "multiply",
                transition: `opacity ${fxIntro.landing}s ease-in-out`,
            }}
        >
            <img
                src="./biennale_logo.jpg"
                alt="Biennale Logo"
                style={{ width: "100%", height: "auto" }}
            />
        </Box>
    );
}

function Credits({ path }) {
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch(path)
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 4 }}>
                <img
                    src="./kosovo_logo.png"
                    alt="Kosovo Logo"
                    style={{ maxWidth: "50%", height: "auto", maxHeight: 120 }}
                />
            </Box>
            <ReactMarkdown
                components={{
                    p: ({ node, ...props }) => (
                        <Typography
                            {...props}
                            sx={{ textAlign: "justify", mt: 0, mb: 3 }}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </>
    );
}
