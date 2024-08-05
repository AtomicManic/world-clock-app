import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "esnext", // Use modern syntax for Vite
    rollupOptions: {
      output: {
        format: "cjs", // Electron requires CommonJS format
      },
    },
  },
  server: {
    port: 3000,
  },
});
