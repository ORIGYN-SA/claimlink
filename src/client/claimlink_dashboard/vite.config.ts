import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@atoms": fileURLToPath(new URL("./src/atoms", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@constants": fileURLToPath(
        new URL("./src/constants.ts", import.meta.url),
      ),
      "@auth": fileURLToPath(new URL("./src/auth", import.meta.url)),
      "@dashboard": fileURLToPath(
        new URL("./src/apps/dashboard", import.meta.url),
      ),
      "@buy": fileURLToPath(new URL("./src/apps/buy", import.meta.url)),
      "@earn": fileURLToPath(new URL("./src/apps/earn", import.meta.url)),
      "@govern": fileURLToPath(new URL("./src/apps/govern", import.meta.url)),
      "@wallet": fileURLToPath(new URL("./src/apps/wallet", import.meta.url)),
      "@advanced": fileURLToPath(
        new URL("./src/apps/advanced", import.meta.url),
      ),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
});
