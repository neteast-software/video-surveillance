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
        v-model:value="localZoomLevel"
        reverse
        style="height: 240px"
        :tooltip="false"
        vertical
        :min="minimumZoom"
        :max="maximumZoom"
      />
      <div class="i-icons:reduce icon" @click="zoomOut"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSlider } from "naive-ui";
import { ref, watch } from "vue";
const emit = defineEmits(["update:zoomLevel"]);
const props = defineProps({
  zoomLevel: Number,
});
const localZoomLevel = ref((props.zoomLevel || 0) / 100);
const step = 2;
const minimumZoom = 2; // 最小缩放距离
const maximumZoom = 100; // 最大缩放距离
function increaseZoom() {
  console.log("加", localZoomLevel.value);
  localZoomLevel.value = Math.max(minimumZoom, localZoomLevel.value - step);
}
function zoomOut() {
  console.log("减", localZoomLevel.value);
  localZoomLevel.value = Math.min(maximumZoom, localZoomLevel.value + step);
}
// 当滑块或按钮改变时，通知父组件更新 zoomLevel
watch(localZoomLevel, (newZoom) => {
  emit("update:zoomLevel", newZoom * 100);
});
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
