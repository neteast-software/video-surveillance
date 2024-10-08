import defineNeteastConfig, {
  colors as themeColors,
} from "unocss-preset-neteast";
import presetIconify from "unocss-preset-iconify";

export default defineNeteastConfig({
  presets: [
    presetIconify([{ dir: "src/icons", palette: false, onDemand: false }]),
  ],
  theme: {
    colors: {
      primary: "rgb(var(--primary-color))",
      primaryBg: "rgb(var(--primaryBg-color))",
      lightGrey: "rgb(var(--text-lightGrey))",
      greyBg: "rgb(var(--bg-grey))",
      greyText: "#8A92A6",
      greyLine: "rgb(var(--border-grey))",
    },
    textColor: {
      basic: "rgb(var(--text-basic))",
    },
  },
});
