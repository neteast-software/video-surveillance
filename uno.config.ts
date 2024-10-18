import defineNeteastConfig, {
  colors as themeColors,
} from "unocss-preset-neteast";
import presetIconify from "unocss-preset-iconify";

export default defineNeteastConfig({
  presets: [
    presetIconify([
      { dir: "src/icons", palette: false, onDemand: false },
      { dir: "src/assets/palette", palette: true, onDemand: false },
    ]),
  ],
  theme: {
    colors: {
      primary: "rgb(var(--primary-color))",
      primaryBg: "rgb(var(--primary-bg-color))",
      lightGrey: "rgb(var(--text-lightGrey))",
      primaryLightBg: "rgb(var(--primary-lightBg))",
      greyText: "#8A92A6",
      greyLine: "rgb(var(--border-grey))",
      success: "rgb(var(--success-color))",
      successBg: "rgb(var(--success-bg-color))",
      warning: "rgb(var(--warning-color))",
      warningBg: "rgb(var(--warning-bg-color))",
      error: "rgb(var(--error-color))",
      errorBg: "rgb(var(--error-bg-color))",
      info: "rgb(var(--info-color))",
      infoBg: "rgb(var(--info-bg-color))",
    },
    textColor: {
      basic: "rgb(var(--text-basic))",
    },
    breakpoints: {
      laptop: "1540px",
    },
  },
});
