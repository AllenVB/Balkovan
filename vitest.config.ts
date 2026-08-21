import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // "@/*" yol takma adlari tsconfig.json'dan okunur (Vite'in yerlesik destegi).
  resolve: {
    tsconfigPaths: true,
    alias: [
      // "server-only" yalnizca Next.js derlemesinde anlamli; testte bos modul.
      { find: /^server-only$/, replacement: "./src/test/server-only-stub.ts" },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Veritabanina karsi calisan testler DATABASE_URL'e ihtiyac duyar.
    setupFiles: ["./src/test/setup.ts"],
  },
});
