<template>
  <div
    class="fill-parent bg-#94BFFF p-7 lt-laptop-(p-3) relative overflow-hidden flex justify-between"
  >
    <LeftAside class="z-1"></LeftAside>
    <RightAside class="z-1"></RightAside>
    <equipDetails v-show="curDetailId !== 0"></equipDetails>
    <alarmList v-show="alarmCurDetailId !== 0"></alarmList>
    <div class="absolute top-0 left-0 w-full h-full z-0">
      <CesiumTianditu></CesiumTianditu>
      <PointBubble></PointBubble>
      <Transition name="slideRight">
        <MapControls class="absolute right-7.5 bottom-7.5 z-1"></MapControls>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftAside from "./leftAside.vue";
import RightAside from "./rightAside.vue";
import CesiumTianditu from "@/components/map/CesiumTianditu.vue";
import { onBeforeUnmount } from "vue";
import PointBubble from "./pointBubble.vue";
import MapControls from "@/components/map/mapControls.vue";
import equipDetails from "@/components/other/equipDetails.vue";
import alarmList from "@/components/other/alarmList.vue";
import { bubbleVisible } from "@/utils/map/mark";
import { useMapInfoStore } from "@/stores/mapInfo";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
const mapInfo = useMapInfoStore();
const { curDetailId, isMapReady, alarmCurDetailId } = storeToRefs(mapInfo);
const deviceInfo = useDeviceInfoStore();
const { curdeviceListId } = storeToRefs(deviceInfo);

onBeforeUnmount(() => {
  curdeviceListId.value = 0;
  bubbleVisible.value = false;
  curDetailId.value = 0;
});
</script>

<style scoped></style>
