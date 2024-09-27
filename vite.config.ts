import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCss from "unocss/vite";
import { resolve } from "path";

const pathResolve = (dir: string) => resolve(__dirname, dir);
export default defineConfig({
  resolve: {
    alias: {
      "@": pathResolve("src"),
    },
  },
  plugins: [vue(), UnoCss()],
});
