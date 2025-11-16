import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { CircularProgress, Container, Typography } from "@mui/material";

import StylizedCharacters from "./StylizedCharacters";

import { randomStyle } from "../utils";

import { useTheme } from "@mui/material";

export default function MarkdownPage({ title, path, entry }) {
    const theme = useTheme();
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch(`data/mds/${entry.text}.md`)
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, [entry]);

    if (!content) return <CircularProgress />;

    return (
        <>
            <ReactMarkdown
                components={{
                    h1: ({ node, ...props }) => (
                        <Typography
                            variant="h2"
                            sx={{
                                pt: "20vh",
                                mb: theme.bannerH,
                                textTransform: "uppercase",

                                // fontFeatureSettings: `"ss0${randomStyle()}" 1`,
                            }}
                        >
                            <StylizedCharacters
                                label={props.children}
                                percentage={0.8}
                                seed={Math.random() * 1000}
                            />
                        </Typography>
                    ),
                    h2: ({ node, ...props }) => (
                        <div
                            sx={{
                                mt: theme.bannerH,
                            }}
                        >
                            <Typography
                                variant="h4"
                                {...props}
                                // sx={{
                                //     mt: theme.bannerH,
                                // }}
                            >
                                <StylizedCharacters
                                    label={props.children}
                                    percentage={0.5}
                                    seed={Math.random() * 1000}
                                />
                            </Typography>
                        </div>
                    ),

                    strong: ({ node, ...props }) => (
                        <Typography
                            component="span"
                            sx={{
                                fontWeight: "bold",
                                textDecoration: "underline",
                                // mr: 1,
                            }}
                            {...props}
                        />
                    ),
                    p: ({ node, ...props }) => (
                        <Typography
                            {...props}
                            sx={{
                                textAlign: "left",
                                m: "1em 0",
                                fontFamily: theme.fonts.article,
                                lineHeight: "1.2rem",
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
