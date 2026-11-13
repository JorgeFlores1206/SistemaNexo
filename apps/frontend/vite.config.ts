import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // Electron loads the production build with file://, so assets must be
  // resolved relative to index.html instead of the web server root.
  base: "./",
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@nexo/contracts": path.resolve(process.cwd(), "../../packages/contracts/src/index.ts"),
    },
  },
});
