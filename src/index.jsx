import "./style.css";
import ReactDOM from "react-dom/client";
const root = ReactDOM.createRoot(document.querySelector("#root"));
import { ThemeProvider } from "@mui/material/styles";
import theme from "./ui/theme.js";

import App from "./App";
import Ui from "./ui/Ui";
import { useStore } from "./store/useStore";

const setScale = useStore.getState().setScale;

Init();
root.render(
    <>
        <ThemeProvider theme={theme}>
            {/* Buttons */}
            {/* <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
            <button onClick={() => setScale("xl")}>Sphere</button>
            <button onClick={() => setScale("m")}>Flat Grid</button>
            <button onClick={() => setScale("xs")}>Inverted Sphere</button>
        </div> */}

            <Ui />
            <App />
        </ThemeProvider>
    </>
);

async function Init() {
    setScale("m");
}
