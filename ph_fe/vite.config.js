// vite.config.ts hoặc vite.config.js

import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: '../ph_fe/dist', // Đảm bảo đúng đường dẫn
    emptyOutDir: true,
  },
  base: '/',
});
