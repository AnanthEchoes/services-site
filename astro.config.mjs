import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",       // ✅ enable runtime server rendering
  adapter: cloudflare(),  // ✅ Cloudflare runtime support
  vite: {
    plugins: [tailwindcss()],
  },
});
