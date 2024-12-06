<template>
  <div class="text-basic">
    <!-- <div class="button hover:scale-106" @click="toggleBaseMapStyle">
      <div
        class="icon"
        :class="{
          'i-icons:sun': curBaseMapStyle,
          'i-icons:moon': !curBaseMapStyle,
        }"
      ></div>
    </div> -->
    <div class="button hover:scale-106 my-3" @click="show3D = !show3D">
      {{ show3D ? "2D" : "3D" }}
    </div>
    <div class="button my-3 hover:scale-106" @click="backOrigin = true">
      <div class="i-icons:backorigin icon"></div>
    </div>
    <div class="button flex-col gap-1">
      <div class="i-icons:add icon" @click="zoomInBus.emit()"></div>
      <div class="w-full h-1px bg-greyLine"></div>
      <div class="i-icons:reduce icon" @click="zoomOutBus.emit()"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventBus } from "@vueuse/core";
import { zoomInEvent, zoomOutEvent } from "@/config/eventBus";
import { useMapInfoStore } from "@/stores/mapInfo";
import { storeToRefs } from "pinia";

const mapInfo = useMapInfoStore();
const { show3D, backOrigin, curBaseMapStyle } = storeToRefs(mapInfo);

const zoomInBus = useEventBus(zoomInEvent);
const zoomOutBus = useEventBus(zoomOutEvent);

function toggleBaseMapStyle() {
  curBaseMapStyle.value = !curBaseMapStyle.value;
}
</script>

<style scoped>
.button {
  @apply p-2 bg-white flex-center rounded-1 cursor-pointer transition;
}

.icon {
  @apply !m-0 !w-6 !h-6;
}

:deep(.n-slider .n-slider-rail) {
  @apply bg-#CAD3EF;
}
</style>
