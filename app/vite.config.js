import { defineConfig } from "vite";

export default defineConfig({
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: "0.0.0.0",
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Android target
    target:
      process.env.TAURI_ENV_PLATFORM === "android" ||
      process.env.TAURI_ENV_PLATFORM === "ios"
        ? "safari13"
        : process.env.TAURI_ENV_PLATFORM === "windows"
          ? "chrome105"
          : "chrome105",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
