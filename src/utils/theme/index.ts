import { useDark, useToggle, useCssVar } from "@vueuse/core";
import {
  computed,
  unref,
  CSSProperties,
  watch,
  shallowReactive,
  shallowRef,
  nextTick,
  ref,
} from "vue";
import { darkTheme, lightTheme } from "naive-ui";
import type { GlobalThemeOverrides } from "naive-ui";
import color, { getColorPalette } from "./color";
import useSharedThemeColors from "./color";
import { AnyColor, colord } from "colord";
// import tailwindPreset from '@ebuild/presets';
type colorType =
  | "primary"
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";
export const isDark = useDark();
export const toggleDarkMode = useToggle(isDark);
export const naiveTheme = computed(() => {
  return isDark.value ? darkTheme : lightTheme;
});

function formatRGB(rgb: string) {
  const rgbArr = rgb.split(" ");
  return `rgb(${rgbArr.join(",")})`;
}
function getCssRGB(cssVarName: string) {
  const cssVar = useCssVar(cssVarName);
  return formatRGB(cssVar.value);
}

export async function getCssColors() {
  await nextTick();
  const primaryColor = getCssRGB("--primary-color");
  const basicColor = getCssRGB("--text-basic"); //#040a12
  const bgColorDeep = getCssRGB("--bg-color-deep");
  const bgColor = getCssRGB("--bg-color");
  const infoColor = getCssRGB("--info-color");
  const successColor = getCssRGB("--success-color");
  const warningColor = getCssRGB("--warning-color");
  const errorColor = getCssRGB("--error-color");
  const tableHover = getCssRGB("--table-hover");
  return {
    primaryColor,
    basicColor,
    bgColorDeep,
    bgColor,
    infoColor,
    successColor,
    warningColor,
    errorColor,
    tableHover,
  };
}
export function useSharedCssColors() {
  const cssColors = shallowRef<Record<string, string>>({});
  watch(
    isDark,
    async () => {
      cssColors.value = await getCssColors();
    },
    { immediate: true }
  );
  function getCssColor(type?: colorType) {
    if (!type || typeof type !== "string") return;
    const color = cssColors.value[`${type}Color`];
    return color;
  }
  return {
    cssColors,
    getCssColor,
  };
}
function getNaiveColorPalettes(color: AnyColor) {
  const hoverColor = getColorPalette(color, 5);
  const pressedColor = getColorPalette(color, 7);
  const supplColor = getColorPalette(color, 5);
  return { hover: hoverColor, suppl: supplColor, pressed: pressedColor };
}
export default function useTheme() {
  // const primaryColorVar = useCssVar('--primary-color');
  // const basicColorVar = useCssVar('--text-color'); //#040a12
  const naiveThemeOverrides = shallowRef<GlobalThemeOverrides>({});
  const colorPrimary = ref("");
  const colorBg = ref("");
  const colorText = ref("");
  watch(
    isDark,
    async () => {
      const {
        primaryColor,
        basicColor,
        bgColorDeep,
        bgColor,
        warningColor,
        errorColor,
        infoColor,
        tableHover,
      } = await getCssColors();
      colorPrimary.value = primaryColor;
      colorBg.value = bgColor;
      colorText.value = basicColor;
      // primary.value = primaryColor
      const colors = [primaryColor, infoColor, warningColor, errorColor];
      const [primary, info, warning, error] = colors.map((color) =>
        getNaiveColorPalettes(color)
      );

      naiveThemeOverrides.value = {
        common: {
          primaryColor,
          primaryColorHover: primary.hover,
          primaryColorPressed: primary.pressed,
          primaryColorSuppl: primary.suppl,
          infoColor,
          infoColorHover: info.hover,
          infoColorPressed: info.pressed,
          infoColorSuppl: info.suppl,
          warningColor,
          warningColorHover: warning.hover,
          warningColorPressed: warning.pressed,
          warningColorSuppl: warning.suppl,
          errorColor,
          errorColorHover: error.hover,
          errorColorPressed: error.pressed,
          errorColorSuppl: error.suppl,
          // primaryColor: '#015C5FFF',
          tableHeaderColor: "#FFFFFF",
          tableColorHover: "rgba(0, 0, 100, 0.03)",
        },
        Button: {
          colorHover: colorPrimary.value,
        },
      };
    },
    { immediate: true }
  );

  return {
    naiveThemeOverrides,
    isDark,
    colorPrimary,
    colorBg,
    colorText,
  };
}
export const sliderTriggerStyle = computed<CSSProperties>(() => {
  return {
    height: "60px",
    width: "40px",
    borderWidth: "1px",
    borderRadius: "228px",
    fontSize: "20px",
  };
});
