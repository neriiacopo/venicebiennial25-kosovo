import ReactMarkdown from "react-markdown";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState, useMemo, Fragment } from "react";

import MovingBox from "./MovingBox";
import StylizedCharacters from "./StylizedCharacters";

import { glowTextFx, randomStyle } from "../utils";

import { useTheme } from "@mui/material/styles";
import { useStore } from "../store/useStore";
import { useLoadingStore } from "../store/loadingStore";

export default function Landing({}) {
    const isMobile = useStore((state) => state.isMobile);
    const landing = useStore((state) => state.landing);
    const ratios = {
        credits: "33%",
        intro: "52%",
        logo: isMobile ? "17dvh" : "15%",
    };
    const longerDivRef = useRef(null);
    const fxIntro = useStore((state) => state.fxIntro);

    useEffect(() => {
        if (longerDivRef.current) {
            const handleChildrenLoaded = () => {
                if (longerDivRef.current) {
                    const totalH = longerDivRef.current.scrollHeight;
                    useStore.setState({ introH: totalH });
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
                content={<Title isMobile={isMobile} />}
                pt={0}
                zIndex={-2}
            />
            {isMobile ? (
                <>
                    <Box
                        sx={{
                            position: "absolute",
                            width: ratios.logo,
                            maxWidth: ratios.logo,
                            height: "15dvh",
                            // maxHeight: 100,
                            zIndex: 1000,
                            bottom: 0,
                            left: 0,
                            textAlign: "left",
                            opacity: landing ? 1 : 0,
                            pointerEvents: "none",
                            p: 4,
                            mixBlendMode: "multiply",
                            transition: `opacity ${fxIntro.landing}s ease-in-out`,
                        }}
                    >
                        <img
                            src={"./kosovo_logo.png"}
                            alt={"Kosovo Logo"}
                            style={{ width: "auto", height: "100%" }}
                        />
                    </Box>
                </>
            ) : (
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
                                <Credits
                                    path={"./data/mds/landing/credits.md"}
                                />
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
            )}
        </>
    );
}

// const seed = Math.random() * 1000;

function Title({ isMobile, ...props }) {
    const theme = useTheme();
    const blurTitle = useStore((state) => state.blurTitle);
    const dataProgress = useLoadingStore((state) => state.dataProgress);

    const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000));
    const mobilePressed = useStore((state) => state.mobilePressed);
    const [content, setContent] = useState([]);

    // useEffect(() => {
    //     const id = setInterval(() => {
    //         setSeed(Math.floor(Math.random() * 1000));
    //     }, 500);
    //     return () => clearInterval(id);
    // }, []);

    const noisy = {
        filter: isMobile
            ? `blur(${blurTitle ? 0.5 : 5}px)`
            : `blur(${blurTitle ? 1.5 : 5}px)`,
        //  :  `blur(${Math.round(100 - dataProgress) / 10 + 1.5}px)`,
        opacity: blurTitle ? 1 : 0,
        transition: "opacity 0.1s ease-in-out, filter 1s ease-in-out",
        fontFamily: theme.fonts.title,
    };

    useEffect(() => {
        setContent(
            !mobilePressed
                ? [
                      {
                          label: [
                              "Pavilion of the Republic of Kosovo",
                              "at the 19th International Architecture Exhibition",
                              "La Biennale di Venezia",
                          ],
                          glow: isMobile ? "0px" : "2px",
                          variant: isMobile ? "h5" : "h4",
                          my: 4,
                          styled: false,
                      },
                      {
                          label: ["Erzë Dinarama"],
                          glow: isMobile ? "1.5px" : "3px",
                          variant: isMobile ? "h3" : "h2",
                          styled: true,
                      },
                      {
                          label: [
                              "EMERGING",
                              "Lulebora nuk çel më",
                              "ASSEMBLAGES",
                          ],
                          glow: isMobile ? "1.5px" : "3px",
                          variant: isMobile ? "h3" : "h2",
                          styled: true,
                      },
                      {
                          label: [
                              "10.05 – 24.11",
                              "Arsenale, Sestiere Castello,",
                              "Campo della Tana 2169/F, 30122 Venice, Italy",
                          ],
                          glow: isMobile ? "0px" : "2px",
                          variant: isMobile ? "h5" : "h4",
                          mt: 4,
                          styled: false,
                      },
                  ]
                : [
                      {
                          label: [
                              "Open the website from a desktop to explore Emerging Assemblages",
                          ],
                          glow: isMobile ? "1.5px" : "3px",
                          variant: isMobile ? "h3" : "h2",
                          styled: true,
                      },
                  ],
        );
    }, [isMobile, mobilePressed]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    py: isMobile ? "15dvh" : 4,
                    height: "100dvh",
                    width: isMobile ? "80%" : "50%",
                    textAlign: "center",

                    color: theme.colors.grey.darkest,
                    ...props.sx,
                    zIndex: -2,
                }}
            >
                {content.map((item, index) => (
                    <Typography
                        key={index}
                        variant={item.variant}
                        style={{}}
                        sx={{
                            fontFeatureSettings: `"ss0${item.styleSet}" 1`,
                            mb: item.mb || 0,
                            textShadow: blurTitle
                                ? glowTextFx(
                                      item.glow,
                                      theme.colors.grey.darker,
                                      //   item.glow
                                  )
                                : "none",
                            ...noisy,
                        }}
                    >
                        {item.styled
                            ? item.label.map((line, i) => (
                                  <Fragment key={i}>
                                      <StylizedCharacters
                                          label={line}
                                          percentage={0.5}
                                          seed={
                                              line.length *
                                              seed *
                                              (i + 1) *
                                              (index + 1)
                                          }
                                      />
                                      {i != item.label.length ? <br /> : ""}
                                  </Fragment>
                              ))
                            : item.label.map((line, i) => (
                                  <Fragment key={i}>
                                      <span>{line}</span>
                                      {i != item.label.length ? <br /> : ""}
                                  </Fragment>
                              ))}
                    </Typography>
                ))}
            </Box>
        </>
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
        <>
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
        </>
    );
}

function BiennalLogo({
    w,
    opacity,
    url = "./biennale_logo.jpg",
    alt = "Biennale Logo",
}) {
    const fxIntro = useStore((state) => state.fxIntro);
    return (
        <Box
            sx={{
                position: "absolute",
                width: w,
                maxWidth: w,
                top: 0,
                right: 0,
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
                src={url}
                alt={alt}
                style={{ width: "100%", height: "auto" }}
            />
        </Box>
    );
}

function Credits({ path }) {
    const [content, setContent] = useState(null);
    const theme = useTheme();

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
                            sx={{
                                textAlign: "justify",
                                mt: 0,
                                mb: 3,
                                fontSize: "1.05rem",
                                lineHeight: 1.2,
                                fontFamily: theme.fonts.p,
                            }}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </>
    );
}

///// EXTRA
import ButtonL from "./ButtonL";
import { Stack } from "@mui/material";

function PastEditionsBox({ w, opacity }) {
    const theme = useTheme();
    const fxIntro = useStore((state) => state.fxIntro);
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
                bottom: 0,
                right: 0,
                p: 4,
                opacity: opacity,
                transition: `opacity ${fxIntro.landing}s ease-in-out`,
            }}
        >
            <Typography
                variant="h6"
                // sx={{ fontWeight: "bold" }}
            >
                {/* Kosovo Pavilion <br /> previous editions: */}
                Past Editions
            </Typography>
            <Stack
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
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
                            }}
                        >
                            <StylizedCharacters
                                label={n.label}
                                percentage={0.5}
                                seed={n.label.length * (index + 1) * 123}
                            />
                        </Typography>
                    );
                })}
            </Stack>
        </Box>
    );
}

function PastEditions() {
    const theme = useTheme();
    const [drop, setDrop] = useState(false);

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

    function toggleDrop() {
        console.log("dd");
        setDrop(!drop);
    }

    function ButtonS({ label, onClick }) {
        return (
            <Typography
                sx={{
                    textTransform: "none",
                    textDecoration: "underline",
                    textDecorationThickness: "1px",
                    textAlign: "left",
                    m: 0,
                    pr: 2,
                    pointerEvents: "auto",
                    backgroundColor: "transparent",
                    fontSize: "1.05rem",
                }}
                onClick={onClick}
                className="clickable"
            >
                {label}
            </Typography>
        );
    }
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    px: 8,
                    pr: 16,
                    pt: 4,

                    width: "33vw",
                    textAlign: "left",
                    textJustify: "left",
                    display: "flex",
                    flexDirection: "column-reverse",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    opacity: 1,
                    pointerEvents: "none",
                    zIndex: 1000,
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
                        label="Past Editions"
                        onClick={toggleDrop}
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
                {links.map((n, index) => {
                    return (
                        <ButtonL
                            key={index}
                            label={n.label}
                            component="a"
                            onClick={() => {}}
                            href={"https://" + n.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            drop={drop}
                            textAlign="left"
                            initialSelect={true}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}
