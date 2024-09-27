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
        primary: "#4880FF",
        greyBg: "#EFF3F7",
        greyText: "#A0AEC0",
        greyLine: "#EEEEEE",
      },
    },
  }),
]);
