import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCss from "unocss/vite";
import { viteMockServe } from "vite-plugin-mock";
import { resolve } from "path";
import cesium from "vite-plugin-cesium";

const pathResolve = (dir: string) => resolve(__dirname, dir);
export default defineConfig({
  resolve: {
    alias: {
      "@": pathResolve("src"),
    },
  },
  plugins: [
    vue(),
    UnoCss(),
    cesium(),
    viteMockServe({ mockPath: "mock", enable: true }),
  ],

  server: {
    port: 1234,
    proxy: {
      "/api/rtc": {
        target: "http://127.0.0.1:7979",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api": {
        target: "http://220.250.19.58:13402/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
