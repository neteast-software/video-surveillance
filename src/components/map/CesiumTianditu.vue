<template>
  <div>
    <div id="cesiumContainer" class="cesium"></div>
    <div class="button">
      <button @click="toggleBasemap">切换底图颜色 {{ isBlue }}</button>
      <div>
        <button @click="startAnimation(viewer)">开始运动</button>
        <button @click="stopAnimation(viewer)">停止运动</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { cesiumtoken } from "@/utils/map/env";
import { newtdtMap, modifyMap, modifyBuild } from "@/utils/map/modify";
import {
  addDemoGraphic1,
  addDemoGraphic2,
  setupClickHandler,
} from "@/utils/map/mark";
import { setAntialias, updateBuildingVisibility } from "@/utils/map/index";
import {
  addPath,
  setupPathAnimation,
  startAnimation,
  stopAnimation,
  click_draw_polygon,
} from "@/utils/map/path";
// import { ClickToGetLocation } from "../until/ClickToGetLocation";

let isBlue = ref(true);
const viewer: Ref<Cesium.Viewer | null> = ref(null);
//3D建筑物
const tileset = new Cesium.Cesium3DTileset({
  url: "/model/tileset.json",
});

const Cartesian = Cesium.Cartesian3.fromDegrees(119.297, 26.07, 500);

onMounted(() => {
  Cesium.Ion.defaultAccessToken = cesiumtoken;
  viewer.value = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: true, //是否允许动画
    animation: false, //是否显示动画控件
    selectionIndicator: false, //是否显示选取指示器组件
    baseLayerPicker: false, //是否显示图层选择控件
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
    imageryProvider: newtdtMap("cva"),
  });
  viewer.value.imageryLayers.addImageryProvider(newtdtMap("vec"), 0);

  // viewer.value.scene.screenSpaceCameraController.maximumZoomDistance = 100000; //最大缩放距离
  // viewer.value.scene.screenSpaceCameraController.minimumZoomDistance = 200; //最小缩放距离
  viewer.value.scene.primitives.add(tileset); //添加3D建筑物
  // 修改建筑颜色
  modifyBuild(tileset, "1.8, 1.8,1.8");

  //相机
  viewer.value.camera.setView({
    destination: Cartesian, //初始位置
    orientation: {
      //初始方向
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-30),
      roll: Cesium.Math.toRadians(0),
    },
  });
  //添加标记
  addDemoGraphic1(viewer.value);
  addDemoGraphic2(viewer.value);
  setupClickHandler(viewer.value);
  // 监听相机变化显示建筑
  viewer.value.scene.camera.changed.addEventListener(() =>
    updateBuildingVisibility(viewer.value, tileset)
  );
  setAntialias(viewer.value); //抗锯齿

  click_draw_polygon(viewer.value); //绘制多边形
  // ClickToGetLocation(viewer.value); //点击获取位置
  // 添加轨迹路线
  addPath(viewer.value);
  // 设置动画相关
  setupPathAnimation(viewer.value);
  //结束
});

window.addEventListener("resize", function () {
  setAntialias(viewer.value);
});

const toggleBasemap = () => {
  if (!viewer.value) return;
  if (isBlue.value) {
    modifyMap(viewer.value, {
      filterRGB: [66, 70, 75],
      brightness: 0.5,
      contrast: 1,
      gamma: 0.3,
      hue: 0,
    });
    //建筑颜色
    modifyBuild(tileset, "0.08, 0.08, 0.08");
  } else {
    modifyMap(viewer.value, {
      filterRGB: [],
      brightness: 1,
    });
    modifyBuild(tileset, "1.8, 1.8,1.8");
    //重新添加底图
    // if (viewer.imageryLayers.get(0)) {
    //   viewer.value.imageryLayers.remove(viewer.imageryLayers.get(0));
    //   viewer.value.imageryLayers.addImageryProvider(newtdtMap("vec"), 0);
    // }
  }
  // 更新状态
  isBlue.value = !isBlue.value;
};
</script>

<style scoped>
:deep(.cesium-viewer-bottom) {
  display: none !important;
}
.cesium {
  width: 100%;
  height: 100%;
}
.button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
}
</style>
