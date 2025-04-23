import { Box, Button, ToggleButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useStore } from "../store/useStore";

export default function NavFilters() {
    const db = useStore((state) => state.db);
    const narratives = useStore((state) => state.narratives);
    const activeNarratives = useStore((state) => state.activeNarratives);
    const theme = useTheme();
    const bannerH = theme.bannerH;

    const bH = "2.5vh";
    const btns = narratives.map((n) => {
        return {
            value: n,
            label: n,
        };
    });

    function startNarrative(narrative) {
        const relevantIds = db
            .map((d) => (d[narrative] != null ? d.id : undefined))
            .filter((id) => id !== undefined);

        useStore.setState({ selectedId: relevantIds[0] });
    }

    return (
        <>
            <Box
                sx={{
                    width: theme.navW,
                    ml: bannerH,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                }}
            >
                {btns.map((btn, i) => (
                    <ToggleButton
                        key={i}
                        sx={{
                            px: 2.5,
                            py: 0,
                            my: 0.5,

                            borderRadius: bH,
                        }}
                        onClick={() => startNarrative(btn.value)}
                        size="small"
                        value={btn.value}
                        selected={activeNarratives.includes(btn.value)}
                    >
                        {btn.label}
                    </ToggleButton>
                ))}
            </Box>
        </>
    );
}
