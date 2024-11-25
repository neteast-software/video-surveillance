import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCss from "unocss/vite";
import { viteMockServe } from "vite-plugin-mock";
import { resolve } from "path";
import cesium from "vite-plugin-cesium";

const pathResolve = (dir: string) => resolve(__dirname, dir);
export default defineConfig({
  //   base: "/view", //打包相对路径
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
      // "/api/rtc": {
      //   target: "http://127.0.0.1:7979",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
      "/api": {
        target: "http://116.204.75.102:3889",
        // target: "http://192.168.3.254:3889", //hj-dev
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
