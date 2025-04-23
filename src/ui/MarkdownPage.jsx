import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { CircularProgress, Container, Typography } from "@mui/material";

import { useTheme } from "@mui/material";

export default function MarkdownPage({ path }) {
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
            <ReactMarkdown
                components={{
                    h1: ({ node, ...props }) => (
                        <Typography
                            variant="h2"
                            {...props}
                            sx={{ mr: "20%", mb: theme.bannerH }}
                        />
                    ),
                    h2: ({ node, ...props }) => (
                        <Typography
                            variant="h4"
                            {...props}
                            sx={{ mr: "20%", mt: theme.bannerH }}
                        />
                    ),
                    p: ({ node, ...props }) => (
                        <Typography
                            {...props}
                            sx={{ textAlign: "justify", m: "1em 0" }}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </>
    );
}
