import * as Cesium from "cesium";

//监听相机变化
export function updateBuildingVisibility(
  viewer: Cesium.Viewer | null,
  tileset: Cesium.Cesium3DTileset
) {
  if (!viewer) return;
  const camera = viewer.camera;
  const cameraPosition = camera.positionWC;
  const boundingSphere = tileset.boundingSphere;

  if (boundingSphere) {
    const distance = Cesium.Cartesian3.distance(
      cameraPosition,
      boundingSphere.center
    );
    // 根据距离设置建筑的可见性
    if (distance > 0 && distance < 2000) {
      // 你可以调整这个距离值
      // console.log("show", distance);
      tileset.show = true;
    } else if (distance > 2000 && distance < 30000) {
      tileset.show = false;
      // console.log("hide", distance);
    }
  }
}
//抗锯齿优化
export function setAntialias(viewer: Cesium.Viewer | null) {
  if (!viewer) return;
  if (window.document.body.clientWidth <= 2050) {
    if (window.devicePixelRatio <= 1.25) {
      viewer.resolutionScale = window.devicePixelRatio;
    }
  } else {
    viewer.resolutionScale = 1; // 重置为 1，恢复默认
  }
  // viewer.resolutionScale = window.devicePixelRatio;
}
