import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";

const isCodeSandbox =
    "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

const isCloudflare = process.env.CLOUDFLARE_PAGES === "true";

export default defineConfig({
    plugins: [react(), topLevelAwait()],
    root: ".",
    publicDir: "public",
    base: "/",
    server: {
        host: true,
        open: !isCodeSandbox,
    },
    build: {
        outDir: "./dist",
        emptyOutDir: true,
        sourcemap: true,
    },
});
