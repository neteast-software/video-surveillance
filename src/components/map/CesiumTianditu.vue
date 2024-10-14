<template>
  <div id="cesiumContainer" class="cesium"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, unref, watch } from "vue";
import type { Ref } from "vue";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { cesiumtoken } from "@/utils/map/env";
import { newtdtMap } from "@/utils/map/modify";
import {
  addDemoGraphic1,
  setupClickHandler,
  updateBubblePosition,
} from "@/utils/map/mark";
import { setAntialias, updateBuildingVisibility } from "@/utils/map/index";
import { useEventBus } from "@vueuse/core";
import { zoomKey, zoomUpdateKey } from "@/config/eventBus";
const props = defineProps({
  zoomLevel: Number,
  show3D: Boolean,
});
const emit = defineEmits(["update:zoomLevel"]);
const currentHeading = ref(0); // 当前的方位角
const currentPitch = ref(-30); // 当前的俯仰角
const viewer: Ref<Cesium.Viewer | null> = ref(null);
//3D建筑物
const tileset = new Cesium.Cesium3DTileset({
  url: "/model/tileset.json",
});

const Cartesian = Cesium.Cartesian3.fromDegrees(
  119.297,
  26.07,
  props.zoomLevel
);

function onZoomLevelChange() {
  if (viewer.value) {
    const level = viewer.value.camera.positionCartographic.height;
    zoomUpdateBus.emit(Math.round(level));
  }
}

function updateBuilding() {
  if (viewer.value) updateBubblePosition(viewer.value);
}
function updateBubble() {
  if (viewer.value) updateBubblePosition(viewer.value);
}

onMounted(() => {
  Cesium.Ion.defaultAccessToken = cesiumtoken;
  viewer.value = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: true, //是否允许动画
    animation: false, //是否显示动画控件
    selectionIndicator: false, //是否显示选取指示器组件
    baseLayerPicker: false, //是否显示图层选择控件
    fullscreenButton: false, //是否显示全屏按钮
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
  viewer.value.camera.changed.addEventListener(onZoomLevelChange);
  viewer.value.imageryLayers.addImageryProvider(newtdtMap("vec"), 0);

  viewer.value.scene.screenSpaceCameraController.maximumZoomDistance = 10000; //最大缩放距离
  viewer.value.scene.screenSpaceCameraController.minimumZoomDistance = 200; //最小缩放距离
  viewer.value.scene.primitives.add(tileset); //添加3D建筑物
  tileset.show = props.show3D; //控制3D建筑物的显示

  //相机
  viewer.value.camera.setView({
    destination: Cartesian, //初始位置
    orientation: {
      //初始方向
      heading: Cesium.Math.toRadians(currentHeading.value),
      pitch: Cesium.Math.toRadians(currentPitch.value),
      roll: Cesium.Math.toRadians(0),
    },
  });
  //添加标记
  addDemoGraphic1(viewer.value);
  setupClickHandler(viewer.value);

  viewer.value.scene.camera.changed.addEventListener(updateBuilding); //更新建筑物
  setAntialias(viewer.value); //抗锯齿
  viewer.value.scene.postRender.addEventListener(updateBubble); //更新气泡位置
});

function onResize() {
  setAntialias(viewer.value);
}
watch(
  () => props.show3D,
  (newShow3D) => {
    if (viewer.value) {
      // 控制 3D 建筑物的显示
      tileset.show = newShow3D;
    }
  },
  { immediate: true } // 确保组件加载时也同步显示状态
);
// 更新相机视图
const updateCamera = (zoomLevel: number, oldZoomLevel: number) => {
  if (!viewer.value) return;
  const camera = viewer.value.camera;
  currentHeading.value = camera.heading;
  currentPitch.value = camera.pitch;
  console.log("zoomLevel", zoomLevel);
  if (viewer.value) {
    viewer.value.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(119.297, 26.07, zoomLevel),
      orientation: {
        heading: currentHeading.value,
        pitch: currentPitch.value - (zoomLevel - oldZoomLevel) * 0.0001,
        roll: 0,
      },
    });
  }
};
const zoomBus = useEventBus(zoomKey);
const zoomUpdateBus = useEventBus(zoomUpdateKey);
zoomBus.on(([zoomLevel, oldZoomLevel]) => {
  updateCamera(zoomLevel, oldZoomLevel);
});

window.addEventListener("resize", onResize);

function removeEventListener() {
  const cesium = unref(viewer);
  if (cesium) {
    cesium.camera.changed.removeEventListener(onZoomLevelChange);
    cesium.scene.camera.changed.removeEventListener(updateBuilding);
    cesium.scene.postRender.removeEventListener(updateBubble);
  }
  window.removeEventListener("resize", onResize);
}

function clearEventBus() {
  zoomBus.reset();
  zoomUpdateBus.reset();
}
onBeforeUnmount(() => {
  removeEventListener();
  clearEventBus();
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
.button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
}
</style>
