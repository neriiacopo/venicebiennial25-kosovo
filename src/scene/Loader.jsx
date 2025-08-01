import { useProgress, Html } from "@react-three/drei";
import { useTheme } from "@mui/material/styles";

export default function Loader() {
    const theme = useTheme();
    const { progress } = useProgress();

    return (
        <Html center>
            <div
                style={{
                    fontFamily: theme.fonts.button,
                    fontSize: "1.2rem",
                    color: "black",
                    textAlign: "center",
                }}
            >
                loading {progress.toFixed(0)}%
            </div>
        </Html>
    );
}
