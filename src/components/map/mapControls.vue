<template>
  <div class="text-basic">
    <div class="button hover:scale-106 mb-3" @click="show3D = !show3D">
      {{ show3D ? "2D" : "3D" }}
    </div>
    <!-- <div class="button hover:scale-106">
      <div class="i-icons:settings icon"></div>
    </div> -->
    <div class="button my-3 hover:scale-106" @click="backOrigin = true">
      <div class="i-icons:backorigin icon"></div>
    </div>
    <div class="button flex-(col center) gap-1">
      <div class="i-icons:add icon" @click="increaseZoom"></div>
      <!-- :tooltip="false" -->

      <NSlider
        :value="localZoomLevel"
        reverse
        style="height: 240px"
        vertical
        :min="minimumZoom"
        :max="maximumZoom"
        @update:value="
          zoomBus.emit([$event * 100, localZoomLevel * 100]);
          localZoomLevel = $event;
        "
      />
      <div class="i-icons:reduce icon" @click="zoomOut"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSlider } from "naive-ui";
import { onBeforeUnmount, ref, watch } from "vue";
import { useEventBus } from "@vueuse/core";
import { zoomKey, zoomUpdateKey } from "@/config/eventBus";
import { useMapInfoStore } from "@/stores/mapInfo";
import { storeToRefs } from "pinia";

const mapInfo = useMapInfoStore();
const { zoomLevel, show3D, backOrigin } = storeToRefs(mapInfo);

//倍数
const Level = 100;

const localZoomLevel = ref((zoomLevel.value || 0) / Level);
const step = 2;
const minimumZoom = 2; // 最小缩放距离
const maximumZoom = 100; // 最大缩放距离
const zoomBus = useEventBus(zoomKey);
const zoomUpdateBus = useEventBus(zoomUpdateKey);
zoomUpdateBus.on((zoom) => {
  localZoomLevel.value = zoom / Level;
});
function increaseZoom() {
  const oldZoom = localZoomLevel.value;
  localZoomLevel.value = Math.max(minimumZoom, localZoomLevel.value - step);
  zoomBus.emit([localZoomLevel.value * Level, oldZoom * Level]);
}
function zoomOut() {
  const oldZoom = localZoomLevel.value;
  localZoomLevel.value = Math.min(maximumZoom, localZoomLevel.value + step);
  zoomBus.emit([localZoomLevel.value * Level, oldZoom * Level]);
}

// 当滑块或按钮改变时，通知父组件更新 zoomLevel
watch(localZoomLevel, (newZoom) => {
  zoomLevel.value = newZoom * Level;
});
onBeforeUnmount(() => {
  zoomBus.reset();
  zoomUpdateBus.reset();
});
</script>

<style scoped>
.button {
  @apply p-2 bg-white flex-center rounded-1 cursor-pointer transition;
}
/* .button:hover {
  @apply bg-#F4F8FF;
} */

.icon {
  width: 24px;
  height: 24px;
}
</style>
