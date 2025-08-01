import "./style.css";
import "./fonts.css";

import ReactDOM from "react-dom/client";

import { useStore } from "./store/useStore.jsx";
import App from "./scene/App";
import Ui from "./ui/Ui";
import Landing from "./ui/Landing";
import Cursor from "./ui/Cursor";
import PageScroller from "./ui/PageScroller";
import SVGNoiseBackground from "./ui/SVGNoiseBackground.jsx";

import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./ui/theme.js";

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<AppWrapper />);

function AppWrapper() {
    const landing = useStore((state) => state.landing);
    const selectedId = useStore((state) => state.selectedId);
    const fxIntro = useStore((state) => state.fxIntro);

    const opacityApp = landing ? 0 : selectedId != null ? 0.4 : 1;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Extra */}
            <Cursor />
            <PageScroller scroll={landing} />
            <Ui />
            <Landing />

            <div
                style={{
                    visibility: landing ? `hidden` : `visible`,
                    opacity: opacityApp,
                    filter: `blur(${
                        landing ? 100 : selectedId != null ? 10 : 0
                    }px)`,
                    transition: `opacity ${fxIntro.app}s ease-in-out, filter 2s `,
                    position: `absolute`,
                    top: 0,
                    left: 0,
                    width: `100vw`,
                    height: `100vh`,
                    zIndex: 1,
                }}
            >
                <App />
            </div>
            <SVGNoiseBackground />
        </ThemeProvider>
    );
}
