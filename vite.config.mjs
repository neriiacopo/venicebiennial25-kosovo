import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";

const isCodeSandbox =
    "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default defineConfig({
    plugins: [react(), topLevelAwait()],
    root: "src",
    publicDir: "public",
    base: "/venicebiennial25-kosovo/",
    server: {
        host: true,
        open: !isCodeSandbox,
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true,
    },
});
