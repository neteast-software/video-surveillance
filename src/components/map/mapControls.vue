<template>
  <div class="text-basic">
    <div class="button hover:scale-106">
      <div class="i-icons:settings icon"></div>
    </div>
    <div class="button my-3 hover:scale-106">
      <div class="i-icons:refresh icon"></div>
    </div>
    <div class="button flex-(col center) gap-1">
      <div class="i-icons:add icon" @click="increaseZoom"></div>
      <NSlider
        :value="localZoomLevel"
        reverse
        style="height: 240px"
        :tooltip="false"
        vertical
        :min="minimumZoom"
        :max="maximumZoom"
        @update:value="zoomBus.emit([$event * 100, localZoomLevel * 100]);localZoomLevel = $event"
      />
      <div class="i-icons:reduce icon" @click="zoomOut"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSlider } from "naive-ui";
import { onBeforeUnmount, ref, watch } from "vue";
import {useEventBus} from '@vueuse/core'
import { zoomKey, zoomUpdateKey } from "@/config/eventBus";
const emit = defineEmits(["update:zoomLevel"]);
const props = defineProps({
  zoomLevel: Number,
});
const localZoomLevel = ref((props.zoomLevel || 0) / 100);
const step = 2;
const minimumZoom = 2; // 最小缩放距离
const maximumZoom = 80; // 最大缩放距离
const zoomBus = useEventBus(zoomKey)
const zoomUpdateBus = useEventBus(zoomUpdateKey)
zoomUpdateBus.on((zoom) => {
  localZoomLevel.value = zoom / 100;
})
function increaseZoom() {
  const oldZoom = localZoomLevel.value;
  localZoomLevel.value = Math.max(minimumZoom, localZoomLevel.value - step);
  zoomBus.emit([localZoomLevel.value * 100, oldZoom * 100]);
}
function zoomOut() {
  const oldZoom = localZoomLevel.value;
  localZoomLevel.value = Math.min(maximumZoom, localZoomLevel.value + step);
  zoomBus.emit([localZoomLevel.value * 100, oldZoom * 100]);
}



// 当滑块或按钮改变时，通知父组件更新 zoomLevel
watch(localZoomLevel, (newZoom) => {
  emit("update:zoomLevel", newZoom * 100);
});
onBeforeUnmount(() => {
  zoomBus.reset()
  zoomUpdateBus.reset()
})
</script>

<style scoped>
.button {
  @apply p-2 bg-white rounded-1 cursor-pointer transition;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
