<template>
  <div
    class="fill-parent bg-#94BFFF p-7.5 lt-laptop-(p-3) relative overflow-hidden flex justify-between"
  >
    <LeftAside class="z-1"></LeftAside>
    <RightAside class="z-1"></RightAside>
    <div class="absolute top-0 left-0 w-full h-full z-0">
      {{ curdeviceType }} {{ curDeviceStatus }}
      <CesiumTianditu
        v-model:zoomLevel="zoomLevel"
        v-model:show3D="show3D"
        v-model:back-origin="backOrigin"
      ></CesiumTianditu>
      <PointBubble></PointBubble>
      <Transition appear name="slideRight">
        <MapControls
          v-model:zoomLevel="zoomLevel"
          v-model:show3D="show3D"
          v-model:back-origin="backOrigin"
          class="absolute right-7.5 bottom-7.5 z-1"
        ></MapControls>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftAside from "./leftAside.vue";
import RightAside from "./rightAside.vue";
import CesiumTianditu from "@/components/map/CesiumTianditu.vue";
import { ref } from "vue";
import PointBubble from "./pointBubble.vue";
import MapControls from "@/components/map/mapControls.vue";

const zoomLevel = ref(500);
const show3D = ref(false);
const backOrigin = ref(false);

import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
const deviceInfo = useDeviceInfoStore();
const { curdeviceType, curDeviceStatus } = storeToRefs(deviceInfo);
</script>

<style scoped></style>
