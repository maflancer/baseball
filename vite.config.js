import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/baseball/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setupTest.js",
  },
});
