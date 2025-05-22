import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/", // Important for Azure Static Web Apps or App Service

    server: {
      host: "::",
      port: 3000,
      proxy: isDev
        ? {
            "/ws": {
              target: "ws://localhost:8080",
              ws: true,
              changeOrigin: true,
            },
          }
        : undefined,
    },

    plugins: [
      react(),
      isDev && componentTagger(),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
