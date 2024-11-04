<template>
  <div id="cesiumContainer" class="cesium"></div>
</template>

<script setup lang="ts">
import { flyToPositionKey, zoomKey, zoomUpdateKey } from '@/config/eventBus';
import { useDeviceInfoStore } from '@/stores/deviceInfo';
import { useMapInfoStore } from '@/stores/mapInfo';
import { setAntialias } from '@/utils/map';
import { addDemoGraphic1, removeAllEntities, setupClickHandler, updateBubblePosition, updatePointStatus } from '@/utils/map/mark';
import { newtdtMap } from '@/utils/map/modify';
import { useEventBus } from '@vueuse/core';
import * as Cesium from 'cesium'
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref, unref, watch } from 'vue';

const currentHeading = ref(0); // 当前的方位角
const currentPitch = ref(-90); // 当前的俯仰角

const mapInfo = useMapInfoStore();
const { zoomLevel, show3D, backOrigin, curBaseMapStyle } = storeToRefs(mapInfo);
const deviceInfo = useDeviceInfoStore();
const { filteredDataList, curdeviceListId } = storeToRefs(deviceInfo);

const Cartesian = Cesium.Cartesian3.fromDegrees(
  119.6, 25.75,
  10000
);
let viewer: Cesium.Viewer | null = null;
const isFlying = ref(false)
onMounted(() => {
  viewer = new Cesium.Viewer('cesiumContainer', {
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
    sceneMode: 2, //2d模式
    requestRenderMode: true
  })
  viewer.scene.debugShowFramesPerSecond = true
  viewer.imageryLayers.addImageryProvider(newtdtMap("vec"))
  viewer.imageryLayers.addImageryProvider(newtdtMap("cva"))
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200; //最小缩放距离


  viewer.scene.postProcessStages.fxaa.enabled = true
  viewer.camera.setView({
    destination: Cartesian,
    orientation: {
      heading: Cesium.Math.toRadians(currentHeading.value),
      pitch: Cesium.Math.toRadians(currentPitch.value),
      roll: Cesium.Math.toRadians(0),
    }
  })
  viewer.dataSources.add(Cesium.GeoJsonDataSource.load('/output.geojson',  {
      stroke: Cesium.Color.LIGHTCORAL,
    })).then(function(dataSource) {
      console.log('dataSource', dataSource.entities.values)
      flyToOrigin().then(mapInfo.showControlBar)
    })

  viewer.scene.preRender.addEventListener(updateBubble);
  addDemoGraphic1(viewer);
  setupClickHandler(viewer)
  
})
const zoomBus = useEventBus(zoomKey);
const zoomUpdateBus = useEventBus(zoomUpdateKey);
zoomBus.on(([zoomLevel, oldZoomLevel]) => {
  updateCamera(zoomLevel, oldZoomLevel);
});
function updateCamera(zoomLevel: number, oldZoomLevel: number) {
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
function onZoomLevelChange() {
  if (viewer) {
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

// 控件相关
// 控制地图3D的显示
watch(
  () => show3D.value,
  (newShow3D) => {
    if (isFlying.value) return
    if (viewer) {
      newShow3D ? viewer.scene.morphTo3D(0) : viewer.scene.morphTo2D(0);
      // if (!newShow3D) backToOrigin(); // 切换到2D时回到原点,防止3D视角下的位置偏移
    }
  },
);
//回到原点
function flyToOrigin() {
  return new Promise((resolve, reject) => {
    if (viewer) {
      const dataSource = viewer.dataSources.get(0);
      isFlying.value = true
      viewer.flyTo(dataSource, {duration: 1}).then(resolve, reject).finally(() => {
        isFlying.value = false
      })
    }
  })
}

watch(
  () => backOrigin.value,
  () => {
    if (backOrigin.value = true) {
      flyToOrigin();
      backOrigin.value = false;
    }
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
function onResize() {
  setAntialias(viewer);
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