import {
  SVG,
  cleanupSVG,
  parseColorsSync,
  isEmptyColor,
  runSVGO,
  IconSet,
  importDirectorySync,
} from "@iconify/tools";
import { CustomIconLoader } from "@iconify/utils/lib/loader/types";
import path from "path";
function cleanSvg(svg: string | SVG, monotone = true) {
  if (typeof svg === "string") {
    svg = new SVG(svg);
  }
  cleanupSVG(svg);
  if (monotone) {
    parseColorsSync(svg, {
      defaultColor: "currentColor",
      callback: (_, colorStr, color) => {
        return !color || isEmptyColor(color) ? colorStr : "currentColor";
      },
    });
  }
  runSVGO(svg);
  return svg;
}
function cleanIconSet(iconSet: IconSet, monotone = true) {
  iconSet.forEach((name, type) => {
    const svg = iconSet.toSVG(name);
    if (!svg) {
      iconSet.remove(name);
      return;
    }
    cleanSvg(svg, monotone);
    iconSet.fromSVG(name, svg);
  });
  return iconSet;
}
// 单色svg图标的清理压缩和替换currentColor
export function svgTransformer(svgTxt: string) {
  const svg = cleanSvg(svgTxt);
  return svg.toMinifiedString();
}

export function loadIconSet(dir: string, monotone = true) {
  const collectionName = path.parse(dir).name;
  const iconSet = importDirectorySync(dir);
  const safeList: string[] = [];
  iconSet.forEach((name, type) => {
    if (type !== "icon") return;
    const svg = iconSet.toSVG(name);
    if (!svg) {
      iconSet.remove(name);
      return;
    }
    cleanSvg(svg, monotone);
    iconSet.fromSVG(name, svg);
    // 添加到safeList
    safeList.push(`i-${collectionName}:${name}`);
  });
  const loader: CustomIconLoader = (name: string) => {
    return iconSet.toSVG(name)?.toMinifiedString();
  };
  return {
    collection: { [collectionName]: loader },
    safeList,
  };
}
