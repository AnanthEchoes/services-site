// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server", // required for SSR (runtime data fetching)
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
