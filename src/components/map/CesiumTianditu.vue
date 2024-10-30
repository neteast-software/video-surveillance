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
  removeAllEntities,
  setupClickHandler,
  updateBubblePosition,
  updatePointStatus,
} from "@/utils/map/mark";
import { setAntialias, updateBuildingVisibility } from "@/utils/map/index";
import { useEventBus } from "@vueuse/core";
import { zoomKey, zoomUpdateKey, flyToPositionKey } from "@/config/eventBus";
import CesiumNavigation from "cesium-navigation-es6";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
import { ClickToGetLocation } from "@/utils/map/ClickToGetLocation";
import { addAllPath } from "@/utils/map/path";
import { useMapInfoStore } from "@/stores/mapInfo";
import { modifyMap } from "@/utils/map/modify";

const mapInfo = useMapInfoStore();
const { zoomLevel, show3D, backOrigin, curBaseMapStyle } = storeToRefs(mapInfo);
const deviceInfo = useDeviceInfoStore();
const { filteredDataList, curdeviceListId } = storeToRefs(deviceInfo);
const currentHeading = ref(0); // 当前的方位角
const currentPitch = ref(-90); // 当前的俯仰角
let viewer: Cesium.Viewer | null = null;
// 3D建筑物
const tileset = new Cesium.Cesium3DTileset({
  url: "/model/tileset.json",
});

// const tileset = new Cesium.Cesium3DTileset({
//   url: "/model1/G228.geojson",
// });
// const Cartesian = Cesium.Cartesian3.fromDegrees(119.6, 25.75, zoomLevel.value); //长乐
const Cartesian = Cesium.Cartesian3.fromDegrees(
  119.33018,
  26.03244,
  zoomLevel.value
); //福州

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
    scene3DOnly: false, //只显示3D场景
    sceneMode: 2, //2d模式
    useBrowserRecommendedResolution: true, // 使用浏览器推荐的分辨率
    requestRenderMode: true,
  });
  viewer.scene.globe.maximumScreenSpaceError = 2; // 适当增加误差来提升性能
  viewer.scene.postProcessStages.fxaa.enabled = true; // 开启FXAA抗锯齿

  // viewer.camera.changed.addEventListener(onZoomLevelChange); //监听相机变化
  viewer.imageryLayers.addImageryProvider(newtdtMap("vec"), 1);
  // viewer.imageryLayers.addImageryProvider(newtdtMap("cva"), 2);
  // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 30000; //最大缩放距离
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200; //最小缩放距离
  // viewer.scene.primitives.add(tileset); //添加3D建筑物
  // tileset.show = props.show3D; //控制3D建筑物的显示

  // const cartographic = Cesium.Cartographic.fromCartesian(
  //   tileset.boundingSphere.center
  // );
  // const surface = Cesium.Cartesian3.fromRadians(
  //   cartographic.longitude, //经度
  //   cartographic.latitude, //纬度
  //   0.0 //高度
  // );
  // const offset = Cesium.Cartesian3.fromRadians(119.31408, 26.0538, 0);
  // const translation = Cesium.Cartesian3.subtract(
  //   offset, //根据中心点坐标和height值计算出的新的坐标点
  //   surface, //根据中心点坐标计算出的地表坐标点
  //   new Cesium.Cartesian3()
  // );
  // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

  // const newPosition = Cesium.Cartesian3.fromDegrees(119.31408, 26.0538, 0);

  // // // 获取变换矩阵，并将模型平移到新位置
  // const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(newPosition);
  // // Cesium.Matrix4.multiplyByUniformScale(modelMatrix, 1, modelMatrix);
  // tileset.modelMatrix = modelMatrix;
  // // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

  ClickToGetLocation(viewer); //点击获取位置
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
  // addAllPath(viewer); // 添加轨迹路线
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

  //修改底图样式
  // modifyMap(viewer, {
  // filterRGB: [255, 255, 255], //灰
  // filterRGB: [39, 48, 78], //蓝黑
  // filterRGB: [25, 27, 34], //黑
  // filterRGB: [25, 25, 112], //蓝
  // brightness: 6,
  // contrast: 0.1,
  // gamma: 6,
  // hue: 0,
  // alpha: 0,
  // });
});

// var heightOffset = 20.0;
// var boundingSphere = tileset.boundingSphere;
// var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
// console.log("surface");
// var surface = Cesium.Cartesian3.fromRadians(
//   cartographic.longitude,
//   cartographic.latitude,
//   0.0
// );
// var offset = Cesium.Cartesian3.fromRadians(
//   cartographic.longitude,
//   cartographic.latitude,
//   heightOffset
// );
// var translation = Cesium.Cartesian3.subtract(
//   offset,
//   surface,
//   new Cesium.Cartesian3()
// );
// tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

function onResize() {
  setAntialias(viewer);
}

// 控制地图3D的显示
watch(
  () => show3D.value,
  (newShow3D) => {
    if (viewer) {
      newShow3D ? viewer.scene.morphTo3D(0) : viewer.scene.morphTo2D(0);
      console.log("newShow3D", newShow3D);
      // if (!newShow3D) backToOrigin(); // 切换到2D时回到原点,防止3D视角下的位置偏移
    }
  },
  { immediate: true } // 确保组件加载时也同步显示状态
);
//回到原点
function backToOrigin() {
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
  () => backOrigin.value,
  () => {
    // emit("update:backOrigin", false);
    backOrigin.value = false;
    backToOrigin();
  }
);

//更新标记点
watch(filteredDataList, () => {
  if (!viewer) return;
  removeAllEntities(viewer);
  addDemoGraphic1(viewer);
});

//选中列表项时更新标记点
const flyToPositionBus = useEventBus(flyToPositionKey);
flyToPositionBus.on(() => {
  if (!viewer) return;
  updatePointStatus(viewer, curdeviceListId.value);
});
//点击修改底图
watch(
  () => curBaseMapStyle.value,
  () => {
    console.log("curBaseMapStyle", curBaseMapStyle);
    if (!viewer) return;
    if (!curBaseMapStyle.value) {
      modifyMap(viewer, {
        filterRGB: [66, 70, 75],
        brightness: 0.5,
        contrast: 1,
        gamma: 0.3,
        hue: 0,
      });
    } else {
      // viewer.imageryLayers.addImageryProvider(newtdtMap("vec"), 0);
      modifyMap(viewer, {
        filterRGB: [],
        brightness: 1,
      });
    }
  }
);

// 更新相机视图
const updateCamera = (zoomLevel: number, oldZoomLevel: number) => {
  if (!viewer) return;
  const camera = viewer.camera;
  currentHeading.value = camera.heading;
  currentPitch.value = camera.pitch;
  if (viewer) {
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(119.6, 25.67, zoomLevel),
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
