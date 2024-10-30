<template>
  <div class="fill-parent relative">
    <NScrollbar
      v-if="filteredDataList.length > 0"
      ref="scrollbar"
      class="px-7.5 lt-laptop-(px-5)"
    >
      <div
        v-for="data in filteredDataList"
        :id="String(data.id)"
        class="bg-primaryLightBg rounded-1 p-5 flex gap-4 mb-5 transition duration-300 border-(2 white/0 solid) lt-laptop-(p-3)"
        @click="selectList(data.id)"
        :class="{ active: curdeviceListId == data.id }"
      >
        <img
          src="../../assets/imgs/text/listImg.png"
          class="w-22 h-22 rounded-1 lt-laptop-(w-20 h-20)"
          alt=""
        />
        <div class="flex-w-rest flex-col justify-between">
          <div class="flex-between">
            <div class="text-4 text-basic truncate flex-w-rest">
              {{ data.name }}
            </div>
            <span class="text-lightGrey">{{ data.compression }}</span>
          </div>
          <div class="flex-between text-greyText h-11">
            <div class="flex-col flex-center lt-laptop-(text-3)">
              <div
                class="text-(basic 4) font-700 flex-center lt-laptop-(text-3.5)"
              >
                {{ data.durationOnline }}h
              </div>
              在线时长
            </div>
            <div class="flex-col flex-center lt-laptop-(text-3)">
              <div
                class="text-(basic 4) font-700 flex-center lt-laptop-(text-3.5)"
              >
                {{ data.resolution }}
              </div>
              分辨率
            </div>
            <div class="flex-(col center) gap-2 lt-laptop-(text-3)">
              <NTag
                :bordered="false"
                size="small"
                :type="FilterStatus(data.status!)"
                class="px-1 h-3.5"
              >
                {{ data.status }}
              </NTag>
              <!-- deviceStatus.find((item) => item.value ===data.status)?.label -->

              设备状态
            </div>
          </div>
        </div>
      </div>
    </NScrollbar>
    <listEmpty v-else></listEmpty>
  </div>
</template>

<script setup lang="ts">
import listEmpty from "@/components/other/listEmpty.vue";
import { NTag, NScrollbar, ScrollbarInst } from "naive-ui";
import { FilterStatus } from "@/utils/other/data";
import { nextTick, ref } from "vue";
import { useEventBus } from "@vueuse/core";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { scrollToItemKey, flyToPositionKey } from "@/config/eventBus";
import { storeToRefs } from "pinia";

const deviceInfo = useDeviceInfoStore();
const { curdeviceListId, filteredDataList } = storeToRefs(deviceInfo);

const flyToPositionBus = useEventBus(flyToPositionKey);
const scrollToItemBus = useEventBus(scrollToItemKey);
function selectList(id: number) {
  curdeviceListId.value = id;
  flyToPositionBus.emit(id);
}
scrollToItemBus.on(scrollbarTo);

const scrollbar = ref<ScrollbarInst | null>(null);
async function scrollbarTo() {
  await nextTick();
  setTimeout(() => {
    const element = document.getElementById(curdeviceListId.value.toString());
    if (element && scrollbar.value) {
      scrollbar.value.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  }, 100);
}
</script>

<style scoped>
.active {
  border: 2px solid #3563ef;
}
</style>
