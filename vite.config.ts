import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCss from "unocss/vite";
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from "path";

const pathResolve = (dir: string) => resolve(__dirname, dir);
export default defineConfig({
  resolve: {
    alias: {
      "@": pathResolve("src"),
    },
  },
  plugins: [vue(), UnoCss(), viteMockServe({ mockPath: 'mock', enable: true }),],

  server: {
    port: 1234,
  },
});
