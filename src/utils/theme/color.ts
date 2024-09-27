import { useCssVar, createSharedComposable } from '@vueuse/core';
import { colord, type AnyColor, extend, HsvColor } from 'colord';
import namesPlugin from 'colord/plugins/names';
import mixPlugin from 'colord/plugins/mix';
extend([namesPlugin, mixPlugin]);
const colorIndexs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'error';
type ColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active';
// type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type ColorIndex = (typeof colorIndexs)[number];
/** 色相阶梯 */
const hueStep = 2;
/** 饱和度阶梯，浅色部分 */
const saturationStep = 16;
/** 饱和度阶梯，深色部分 */
const saturationStep2 = 5;
/** 亮度阶梯，浅色部分 */
const brightnessStep1 = 5;
/** 亮度阶梯，深色部分 */
const brightnessStep2 = 15;
/** 浅色数量，主色上 */
const lightColorCount = 5;
/** 深色数量，主色下 */
const darkColorCount = 4;
/**
 * 获取色相渐变
 * @param hsv - hsv格式颜色值
 * @param i - 与6的相对距离
 * @param isLight - 是否是亮颜色
 */
function getHue(hsv: HsvColor, i: number, isLight: boolean) {
    let hue: number;
    const hsvH = Math.round(hsv.h);
    if (hsvH >= 60 && hsvH <= 240) {
        // 冷色调
        // 减淡变亮 色相顺时针旋转 更暖
        // 加深变暗 色相逆时针旋转 更冷
        hue = isLight ? hsvH - hueStep * i : hsvH + hueStep * i;
    } else {
        // 暖色调
        // 减淡变亮 色相逆时针旋转 更暖
        // 加深变暗 色相顺时针旋转 更冷
        hue = isLight ? hsvH + hueStep * i : hsvH - hueStep * i;
    }
    if (hue < 0) {
        hue += 360;
    }
    if (hue >= 360) {
        hue -= 360;
    }
    return hue;
}
/**
 * 获取饱和度渐变
 * @param hsv - hsv格式颜色值
 * @param i - 与6的相对距离
 * @param isLight - 是否是亮颜色
 */
function getSaturation(hsv: HsvColor, i: number, isLight: boolean) {
    // 灰色不渐变
    if (hsv.s === 0) {
        return hsv.s;
    }
    let saturation: number;
    if (isLight) {
        saturation = hsv.s - saturationStep * i;
    } else if (i === darkColorCount) {
        saturation = hsv.s + saturationStep;
    } else {
        saturation = hsv.s + saturationStep2 * i;
    }
    if (saturation > 100) {
        saturation = 100;
    }
    if (isLight && i === lightColorCount && saturation > 10) {
        saturation = 10;
    }
    if (saturation < 6) {
        saturation = 6;
    }
    return saturation;
}
function getValue(hsv: HsvColor, i: number, isLight: boolean) {
    let value: number;
    if (isLight) {
        value = hsv.v + brightnessStep1 * i;
    } else {
        value = hsv.v - brightnessStep2 * i;
    }
    if (value > 100) {
        value = 100;
    }
    return value;
}
export function getColorPalette(color: AnyColor, index: ColorIndex): string {
    const transformColor = colord(color);
    if (!transformColor.isValid()) {
        throw Error('Invalid color');
    }
    if (index === 6) {
        return transformColor.toHex();
    }

    const isLight = index < 6;
    const hsv = transformColor.toHsv();
    const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;
    const newHsv: HsvColor = {
        h: getHue(hsv, i, isLight),
        s: getSaturation(hsv, i, isLight),
        v: getValue(hsv, i, isLight)
    };
    return colord(newHsv).toHex();
}
function getColorPalettes(color: AnyColor, darkTheme = false, darkThemeMixColor = '#141414'): string[] {
    const patterns = colorIndexs.map((index) => getColorPalette(color, index));
    return patterns;
}
function useThemeColors() {
    const primary = useCssVar('--primary-color');
    // const primaryHover = useCssVar('--primary-color-hover', undefined, { initialValue: primary.value, observe: true });
    const info = useCssVar('--info-color');
    const success = useCssVar('--success-color');
    const warning = useCssVar('--warning-color');
    const error = useCssVar('--error-color');

    return {
        primary,
        info,
        success,
        warning,
        error
    };
}
export default createSharedComposable(useThemeColors);
