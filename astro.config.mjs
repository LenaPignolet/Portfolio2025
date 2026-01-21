// @ts-check
import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [svgr()],
  },
  integrations: [vue()]
});
