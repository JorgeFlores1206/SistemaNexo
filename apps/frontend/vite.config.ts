import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@nexo/contracts": path.resolve(process.cwd(), "../../packages/contracts/src/index.ts"),
    },
  },
});
