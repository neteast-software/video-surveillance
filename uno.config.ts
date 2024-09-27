import { defineConfig, presetUno, mergeConfigs, presetIcons } from "unocss";
import { svgTransformer, loadIconSet } from "./build/uno.icon";
import path from "path";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import defineNeteastConfig from "unocss-preset-neteast";

const { collection: commonCollection, safeList: commonSafeList } = loadIconSet(
  path.join(__dirname, "./src/assets/common")
);
// export default defineNeteastConfig();
export default mergeConfigs([
  defineNeteastConfig() as any,
  defineConfig({
    presets: [
      presetUno(),
      presetIcons({
        collections: {
          custom: FileSystemIconLoader("./src/assets/common", svgTransformer),
          ...commonCollection,
        },
      }),
    ],
    safelist: [...commonSafeList],
    theme: {
      colors: {
        primary: "rgb(var(--primary-color))",
        primaryBg: "rgb(var(--primaryBg-color))",
        lightGrey: "rgb(var(--text-lightGrey))",
        greyBg: "rgb(var(--bg-grey))",
        greyText: "#A0AEC0",
        greyLine: "rgb(var(--border-grey))",
      },
      textColor: {
        basic: "rgb(var(--text-basic))",
      },
    },
  }),
]);
