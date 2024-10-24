import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const plugins = [];

if (process.env.SENTRY_ORG) {
  plugins.push(
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    }),
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ...plugins],

  server: {
    host: true,
    port: 3000,
  },

  base: "./",

  build: {
    sourcemap: true,
  },
});
