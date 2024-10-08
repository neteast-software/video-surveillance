<template>
  <div id="cesiumContainer" class="cesium"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as Cesium from "cesium";
import { cesiumtoken } from "@/utils/map/env";

//福州市坐标
const Cartesian = Cesium.Cartesian3.fromDegrees(119.306239, 26.075302, 1000);
onMounted(() => {
  Cesium.Ion.defaultAccessToken = cesiumtoken;
  //自定义图层
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
    enablePickFeatures: false,
  });
  //返回的是笛卡尔坐标   经纬度转笛卡尔坐标
  //经度 纬度 高度
  console.log(Cartesian, "Cartesian");
  //viewer是所有Api的开始
  // cesium 初始化
  var viewer = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: true, //是否允许动画
    animation: false, //是否显示动画控件
    selectionIndicator: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    showRenderLoopErrors: false,
    shadows: false,
  });

  //相机
  viewer.camera.setView({
    destination: Cartesian, //初始位置
    orientation: {
      //初始方向
      heading: Cesium.Math.toRadians(-50), //初始方向
      pitch: Cesium.Math.toRadians(-50), //初始方向
      roll: Cesium.Math.toRadians(0),
    },
  });
});
</script>

<style scoped>
:deep(.cesium-viewer-bottom) {
  display: none !important;
}
.cesium {
  width: 100%;
  height: 100%;
}
</style>
