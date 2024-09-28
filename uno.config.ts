// import { defineConfig, presetUno, mergeConfigs, presetIcons } from "unocss";
// import { svgTransformer, loadIconSet } from "./build/uno.icon";
// import path from "path";
// import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
// import defineNeteastConfig from "unocss-preset-neteast";
// import presetIconify from "unocss-preset-iconify";

// const { collection: commonCollection, safeList: commonSafeList } = loadIconSet(
//   path.join(__dirname, "/src/Icons")
// );
// // export default defineNeteastConfig();

// export default mergeConfigs([
//   defineNeteastConfig() as any,
//   defineConfig({
//     presets: [
//       presetUno(),
//       presetIcons({
//         collections: {
//           custom: FileSystemIconLoader("/src/Icons", svgTransformer),
//           ...commonCollection,
//         },
//       }),

//       // presetIconify([
//       //   "unoicon/Icons",
//       //   // { dir: "src/assets/common", palette: false, onDemand: true },
//       // ]),
//     ],
//     theme: {
//       colors: {
//         primary: "rgb(var(--primary-color))",
//         primaryBg: "rgb(var(--primaryBg-color))",
//         lightGrey: "rgb(var(--text-lightGrey))",
//         greyBg: "rgb(var(--bg-grey))",
//         greyText: "rgba(var(--text-grey))",
//         greyLine: "rgb(var(--border-grey))",
//       },
//       textColor: {
//         basic: "rgb(var(--text-basic))",
//       },
//     },
//   }),
// ]);
import defineNeteastConfig, {
  colors as themeColors,
} from "unocss-preset-neteast";
import presetIconify from "unocss-preset-iconify";

export default defineNeteastConfig({
  presets: [presetIconify(["src/assets/icons"])],
  theme: {
    colors: {
      primary: "rgb(var(--primary-color))",
      primaryBg: "rgb(var(--primaryBg-color))",
      lightGrey: "rgb(var(--text-lightGrey))",
      greyBg: "rgb(var(--bg-grey))",
      greyText: "rgba(var(--text-grey))",
      greyLine: "rgb(var(--border-grey))",
    },
    textColor: {
      basic: "rgb(var(--text-basic))",
    },
  },
  shortcuts: {
    "item-round-border": "rounded-lg border border-[#F0F4FF]", // 圆角边框
    "text-hover": "hover:text-primary cursor-pointer transition-all", // 字体按钮悬浮样式
    "item-hover-border": "hover:border-primary cursor-pointer transition-all", // 悬浮时，展示主题色边框
    "item-hover-content": "hover:text-primary cursor-pointer transition-all", // 悬浮时，展示主题色字体
    "item-hover-op": "hover:opacity-80 cursor-pointer transition-all", // 悬浮时，透明度变化
    "grid-wing": "grid grid-cols-[1fr_auto_1fr]",
  },
});
