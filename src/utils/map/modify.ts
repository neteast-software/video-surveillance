import * as Cesium from "cesium";
import { tdtKey, subdomains, tdtUrl } from "./env";

//加载天地图
export const newtdtMap = (layer: string) => {
  return new Cesium.WebMapTileServiceImageryProvider({
    url: `${tdtUrl}${layer}_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=${layer}&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tdtKey}`,
    subdomains: subdomains,
    layer: "tdtVecBasicLayer",
    style: "light",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    maximumLevel: 18,
    minimumLevel: 0,
  });
};

//改变底图颜色
export function modifyMap(viewer: any, options: any) {
  const baseLayer = viewer.imageryLayers.get(0);
  baseLayer.brightness = options.brightness || 1; //亮度
  baseLayer.contrast = options.contrast || 1; //对比度
  baseLayer.gamma = options.gamma || 1; //伽马
  baseLayer.hue = options.hue || 0; //色调
  baseLayer.saturation = options.saturation || 1; //饱和度
  const baseFragShader =
    viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources; //获取地球表面着色器
  for (let i = 0; i < baseFragShader.length; i++) {
    const strS = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    let strT = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    if (options.invertColor) {
      strT += `
          color.r = 1.0 - color.r;
          color.g = 1.0 - color.g;
          color.b = 1.0 - color.b;
          `;
    }
    if (options.filterRGB.length > 0) {
      strT += `
          color.r = color.r * ${options.filterRGB[0]}.0/255.0;
          color.g = color.g * ${options.filterRGB[1]}.0/255.0;
          color.b = color.b * ${options.filterRGB[2]}.0/255.0;
          `;
    }
    baseFragShader[i] = baseFragShader[i].replace(strS, strT);
  }
}
//改变建筑颜色
export function modifyBuild(tileset: any, vec3: string) {
  tileset.customShader = new Cesium.CustomShader({
    fragmentShaderText: `
         void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
          {
            vec3 positionMC = fsInput.attributes.positionMC;
            material.diffuse = vec3(${vec3});
  
          }
          `,
  });
}
