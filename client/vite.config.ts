import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) return "react-vendor";
          if (id.includes("node_modules/react-router-dom/")) return "router";
          if (id.includes("node_modules/react-icons/")) return "icons";
          if (id.includes("node_modules/recharts/")) return "charts";
          if (id.includes("node_modules/@tanstack/react-query/")) return "query";
          if (id.includes("node_modules/react-hot-toast/") || id.includes("node_modules/react-helmet-async/")) return "ui-vendor";
          if (id.includes("@vercel/analytics") || id.includes("@vercel/speed-insights")) return "analytics";
        },
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
