import { useDark, useToggle, useCssVar } from '@vueuse/core';
import { computed, unref, CSSProperties, watch, shallowReactive, shallowRef, nextTick, ref } from 'vue';
import { darkTheme, lightTheme } from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';
import color, { getColorPalette } from './color';
import useSharedThemeColors from './color';
import { AnyColor, colord } from 'colord';
// import tailwindPreset from '@ebuild/presets';
type colorType = 'primary' | 'default' | 'success' | 'warning' | 'error' | 'info';
export const isDark = useDark();
export const toggleDarkMode = useToggle(isDark);
export const naiveTheme = computed(() => {
    return isDark.value ? darkTheme : lightTheme;
});

function formatRGB(rgb: string) {
    const rgbArr = rgb.split(' ');
    return `rgb(${rgbArr.join(',')})`;
}
function getCssRGB(cssVarName: string) {
    const cssVar = useCssVar(cssVarName);
    return formatRGB(cssVar.value);
}

export async function getCssColors() {
    await nextTick();
    const primaryColor = getCssRGB('--primary-color');
    const basicColor = getCssRGB('--text-basic'); //#040a12
    const bgColorDeep = getCssRGB('--bg-color-deep');
    const bgColor = getCssRGB('--bg-color');
    const infoColor = getCssRGB('--info-color');
    const successColor = getCssRGB('--success-color');
    const warningColor = getCssRGB('--warning-color');
    const errorColor = getCssRGB('--error-color');
    const tableHover = getCssRGB('--table-hover');
    return {
        primaryColor,
        basicColor,
        bgColorDeep,
        bgColor,
        infoColor,
        successColor,
        warningColor,
        errorColor,
        tableHover
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
        if (!type || typeof type !== 'string') return;
        const color = cssColors.value[`${type}Color`];
        return color;
    }
    return {
        cssColors,
        getCssColor
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
    const colorPrimary = ref('');
    const colorBg = ref('');
    const colorText = ref('');
    watch(
        isDark,
        async () => {
            const { primaryColor, basicColor, bgColorDeep, bgColor, warningColor, errorColor, infoColor, tableHover } =
                await getCssColors();
            colorPrimary.value = primaryColor;
            colorBg.value = bgColor;
            colorText.value = basicColor;
            // primary.value = primaryColor
            const colors = [primaryColor, infoColor, warningColor, errorColor];
            const [primary, info, warning, error] = colors.map((color) => getNaiveColorPalettes(color));

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
                    tableHeaderColor: '#FFFFFF',
                    tableColorHover: 'rgba(0, 0, 100, 0.03)'
                },
                Button: {
                    textColorPrimary: '#fff',
                    textColorHoverPrimary: '#fff',
                    textColorPressedPrimary: '#fff',
                    textColorFocusPrimary: '#fff'
                },
                DataTable: {
                    thTextColor: '#707996',
                    thColor: bgColor,
                    tdColorHover: tableHover
                    // tdColor: bgColor,
                    // tdTextColor: basicColor
                },
                Form: {
                    // labelTextColor: '#838EB6',
                    labelFontSizeLeftMedium: '14px',
                    labelFontSizeTopMedium: '14px'
                },
                Input: {
                    border: `1px solid #ccc`
                    // borderFocus: '1px solid #015C5F',
                    // borderHover: '1px solid #015C5F',
                    // boxShadowFocus: '0 3px 6px -4px rgba(1,92,95.12)',
                },
                // Select: {
                //     border: `1px solid ${infoColor}`,
                // },
                Select: {
                    peers: {
                        InternalSelection: {
                            border: `1px solid #ccc`
                        }
                    }
                },
                Popselect: {},
                Popover: {
                    // padding: '24px 32px'
                },
                Tooltip: {
                    color: '#2B3D56'
                },
                Dropdown: {
                    optionColorHover: 'rgba(225,225,225,0.2)'
                },
                Menu: {
                    itemColorActive: primaryColor,
                    itemColorActiveHover: primaryColor,
                    itemTextColorHover: primaryColor,
                    itemTextColorActive: '#fff',
                    itemIconColorActive: '#fff',
                    itemTextColorActiveHover: '#fff',
                    itemIconColorActiveHover: '#fff',
                    itemTextColor: basicColor,
                    itemIconColor: basicColor,
                    itemColorHover: 'rgba(59,130,246, 0.3)',
                    borderRadius: '4px',
                    itemHeight: '38px'
                    // itemColorActive: '#3D8B80',
                    // itemColorActiveHover: '#3D8B80',
                    // itemTextColorHover: '#3D8B80'
                },
                Pagination: {
                    itemTextColorHover: '#FFFFFFFF',
                    itemTextColorPressed: '#015C5FFF',
                    itemTextColorActive: '#FFFFFFFF',
                    itemColorActive: '#015C5FFF',
                    itemColorHover: '#015C5FFF',
                    itemColorActiveHover: '#015C5FFF',
                    itemBorderActive: '#015C5FFF',
                    itemColorDisabled: 'rgb(250, 250, 252)',
                    jumperTextColor: 'rgb(51, 54, 57)',
                    jumperTextColorDisabled: 'rgba(194, 194, 194, 1)'
                },
                Layout: {
                    color: bgColorDeep,
                    siderColor: bgColorDeep
                },
                Checkbox: {
                    textColor: basicColor
                }
            };
        },
        { immediate: true }
    );

    return {
        naiveThemeOverrides,
        isDark,
        colorPrimary,
        colorBg,
        colorText
    };
}
export const sliderTriggerStyle = computed<CSSProperties>(() => {
    return {
        height: '60px',
        width: '40px',
        borderWidth: '1px',
        borderRadius: '228px',
        fontSize: '20px'
        // color: '#2B3D56'
        // backgroundColor: '#000000',
    };
});
