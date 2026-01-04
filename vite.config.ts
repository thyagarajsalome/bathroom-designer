/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Simulates a browser (fixes "document is not defined")
    globals: true, // Allows using describe/expect without importing
    setupFiles: "./src/setupTests.ts", // Loads custom matchers like "toBeInTheDocument"
  },
});
