import ReactMarkdown from "react-markdown";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState, useMemo, Fragment } from "react";

import MovingBox from "./MovingBox";
import StylizedCharacters from "./StylizedCharacters";

import { glowTextFx, randomStyle } from "../utils";

import { useTheme } from "@mui/material/styles";
import { useStore } from "../store/useStore";

export default function Landing({}) {
    const landing = useStore((state) => state.landing);
    const ratios = { credits: "33%", intro: "52%", logo: "15%" };
    const longerDivRef = useRef(null);

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

const seed = Math.random() * 1000;

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
            label: [
                "Pavilion of the Republic of Kosovo",
                "at the 19th International Architecture Exhibition",
                "La Biennale di Venezia",
            ],
            glow: "2px",
            variant: "h4",
            my: 4,
            styled: false,
        },
        {
            label: ["Erzë Dinarama"],
            glow: "3px",
            variant: "h2",
            styled: true,
        },
        {
            label: ["EMERGING", "Lulebora nuk çel më", "ASSEMBLAGES"],
            glow: "3px",
            variant: "h2",
            styled: true,
        },
        {
            label: [
                "10.05 – 24.11",
                "Arsenale, Sestiere Castello,",
                "Campo della Tana 2169/F, 30122 Venice, Italy",
            ],
            glow: "2px",
            variant: "h4",
            mt: 4,
            styled: false,
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
                    style={{}}
                    sx={{
                        fontFeatureSettings: `"ss0${item.styleSet}" 1`,
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
