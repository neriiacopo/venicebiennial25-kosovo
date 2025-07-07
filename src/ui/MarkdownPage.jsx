import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { CircularProgress, Container, Typography } from "@mui/material";

import { useTheme } from "@mui/material";

export default function MarkdownPage({ title, path }) {
    const theme = useTheme();
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetch(path)
            .then((res) => res.text())
            .then((text) => setContent(text));
    }, []);

    if (!content) return <CircularProgress />;

    return (
        <>
            <Typography
                variant="h2"
                sx={{
                    pt: "20vh",
                    mb: theme.bannerH,
                    textTransform: "uppercase",
                }}
            >
                {title}
            </Typography>
            <ReactMarkdown
                components={{
                    h2: ({ node, ...props }) => (
                        <Typography
                            variant="h4"
                            {...props}
                            sx={{ mt: theme.bannerH }}
                        />
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
                            sx={{ textAlign: "left", m: "1em 0" }}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </>
    );
}
