<template>
  <div id="cesiumContainer" class="cesium"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, unref, watch } from "vue";
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
import CesiumNavigation from "cesium-navigation-es6";
const props = defineProps({
  zoomLevel: Number,
  show3D: Boolean,
  backOrigin: Boolean,
});
const emit = defineEmits(["update:zoomLevel", "update:backOrigin"]);
const currentHeading = ref(0); // 当前的方位角
const currentPitch = ref(-30); // 当前的俯仰角
let viewer: Cesium.Viewer | null = null;
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
  if (viewer) {
    console.log("onZoomLevelChange");
    const level = viewer.camera.positionCartographic.height;
    zoomUpdateBus.emit(Math.round(level));
  }
}

function updateBuilding() {
  if (viewer) updateBubblePosition(viewer);
}
function updateBubble() {
  if (viewer) updateBubblePosition(viewer);
}
onMounted(() => {
  Cesium.Ion.defaultAccessToken = cesiumtoken;
  viewer = new Cesium.Viewer("cesiumContainer", {
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
    terrainProvider: new Cesium.EllipsoidTerrainProvider(), //地形
    // scene3DOnly: true, //只显示3D场景
    // sceneMode: Cesium.SceneMode.SCENE2D, //2d模式
    useBrowserRecommendedResolution: true, // 使用浏览器推荐的分辨率
    requestRenderMode: true,
  });
  viewer.scene.globe.maximumScreenSpaceError = 2; // 适当增加误差来提升性能
  viewer.scene.postProcessStages.fxaa.enabled = true; // 开启FXAA抗锯齿

  viewer.camera.changed.addEventListener(onZoomLevelChange);
  viewer.imageryLayers.addImageryProvider(newtdtMap("vec"), 0);
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000; //最大缩放距离
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200; //最小缩放距离
  viewer.scene.primitives.add(tileset); //添加3D建筑物
  tileset.show = props.show3D; //控制3D建筑物的显示

  //切换成2d模式
  // viewer.scene.morphTo2D(0);

  //相机
  viewer.camera.setView({
    destination: Cartesian, //初始位置
    orientation: {
      //初始方向
      heading: Cesium.Math.toRadians(currentHeading.value),
      pitch: Cesium.Math.toRadians(currentPitch.value),
      roll: Cesium.Math.toRadians(0),
    },
  });
  addDemoGraphic1(viewer); //添加标记
  setupClickHandler(viewer); //点击事件

  viewer.scene.camera.changed.addEventListener(updateBuilding); //更新建筑物
  setAntialias(viewer); //抗锯齿
  // viewer.scene.postRender.addEventListener(updateBubble); //更新气泡位置
  viewer.scene.preRender.addEventListener(updateBubble);

  // 添加比例尺控件
  new CesiumNavigation(viewer, {
    enableCompass: false, // 指南针
    enableZoomControls: false, // 缩放控件
    enableDistanceLegend: true, // 启用比例尺
    enableCompassOuterRing: false, // 启用外环指南针
  });
});

function onResize() {
  setAntialias(viewer);
}
watch(
  () => props.show3D,
  (newShow3D) => {
    if (viewer) {
      // 控制 3D 建筑物的显示
      tileset.show = newShow3D;
    }
  },
  { immediate: true } // 确保组件加载时也同步显示状态
);
//回到原点
function backOrigin() {
  if (viewer) {
    viewer.camera.flyTo({
      destination: Cartesian, //初始位置
      orientation: {
        //初始方向
        heading: Cesium.Math.toRadians(currentHeading.value),
        pitch: Cesium.Math.toRadians(currentPitch.value),
        roll: Cesium.Math.toRadians(0),
      },
      duration: 1.5,
    });
  }
}
watch(
  () => props.backOrigin,
  () => {
    emit("update:backOrigin", false);
    backOrigin();
  }
);

// 更新相机视图
const updateCamera = (zoomLevel: number, oldZoomLevel: number) => {
  if (!viewer) return;
  const camera = viewer.camera;
  currentHeading.value = camera.heading;
  currentPitch.value = camera.pitch;
  console.log("zoomLevel", zoomLevel);
  if (viewer) {
    viewer.camera.setView({
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
:deep(.distance-legend-label) {
  /* color: black !important; */
  @apply text-basic;
}
:deep(.distance-legend-scale-bar) {
  border-left: 1px solid #232d42;
  border-right: 1px solid #232d42;
  border-bottom: 1px solid #232d42;
}
:deep(.distance-legend) {
  right: 66px;
}
</style>
