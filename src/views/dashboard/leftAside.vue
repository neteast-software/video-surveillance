<template>
  <Transition appear name="slideLeft">
    <div class="flex-col gap-4 h-full w-24% min-w-102 lt-laptop-(min-w-92)">
      <header class="bg-white w-full rounded-2px py-6">
        <div class="mx-6 flex justify-between lt-laptop-(mx-3)">
          <div v-for="data in options" class="flex-center">
            <img :src="data.icon" alt="" class="w-7 h-7 lt-laptop-(w-7 h-7)" />
            <div class="ml-2 tracking-normal lt-laptop-(text-3)">
              {{ data.label }}
              <div
                class="text-6 font-700 leading-7.5 mt-1 overflow-hidden lt-laptop-(text-6)"
              >
                {{ data.value }}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div
        class="w-full flex-col flex-h-rest bg-white rounded-2px py-7.5 lt-laptop-(py-5) relative"
      >
        <img
          src="../../assets/imgs/deviceListBg.png"
          class="absolute right-0 top-0 h-37 z-0"
        />
        <header
          class="text-4.5 flex-y-center font-600 mb-4 px-7.5 lt-laptop-(px-5) z-1"
        >
          <div class="w-1 h-4 bg-primary rounded-2px mr-2"></div>
          设备列表
        </header>
        <NTabs
          animated
          v-model:value="curdeviceType"
          :tabs-padding="30"
          class="flex-h-rest"
        >
          <n-tab-pane
            v-for="option in deviceType"
            :name="option.id"
            :tab="option.label"
            class="h-full"
          >
            <div class="fill-parent relative">
              <NScrollbar
                ref="scrollbar"
                class="px-7.5 lt-laptop-(px-5)"
                v-if="filteredDataList.length !== 0"
              >
                <div
                  v-for="data in filteredDataList"
                  :id="String(data.id)"
                  class="bg-primaryLightBg rounded-1 p-5 flex gap-4 mb-5 transition duration-300 border-(2 white/0 solid) lt-laptop-(p-3)"
                  @click="curdeviceListId = data.id"
                  :class="{ active: curdeviceListId == data.id }"
                  ref="deviceList"
                >
                  <img
                    src="../../assets/imgs/text/listImg.png"
                    class="w-22 h-22 rounded-1 lt-laptop-(w-20 h-20)"
                    alt=""
                  />
                  <div class="flex-w-rest flex-col justify-between">
                    <div class="flex-between">
                      <div class="text-4 text-basic">{{ data.name }}</div>
                      <span class="text-lightGrey">{{ data.coding }}</span>
                    </div>
                    <div class="flex-between text-greyText h-11">
                      <div class="flex-col flex-center">
                        <div class="text-(basic 4) font-700 flex-center">
                          {{ data.onlineTime }}
                        </div>
                        在线时长
                      </div>
                      <div class="flex-col flex-center">
                        <div
                          class="text-(basic 4) font-700 flex-center lt-laptop-(text-4)"
                        >
                          {{ data.resolution }}
                        </div>
                        分辨率
                      </div>
                      <div class="flex-(col center) gap-2">
                        <NTag
                          :bordered="false"
                          size="small"
                          :type="FilterStatus(data.status)"
                        >
                          {{
                            DeviceStatus.find(
                              (item) => item.value === data.status
                            )?.label
                          }}
                        </NTag>

                        设备状态
                      </div>
                    </div>
                  </div>
                </div>
              </NScrollbar>
              <div
                class="absolute left-1/2 -translate-x-1/2 mt-12 flex-col flex-center"
                v-else
              >
                <img
                  src="../../assets/imgs/defaultImg.png"
                  class="w-75 h-75"
                  alt=""
                />
                <span class="text-greyText -mt-6"> 暂无数据 </span>
              </div>
            </div>
          </n-tab-pane>
        </NTabs>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { NTag, NTabs, NTabPane, NScrollbar, ScrollbarInst } from "naive-ui";
import { options } from "./data";
import { FilterStatus } from "@/utils/other/index";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
const deviceInfo = useDeviceInfoStore();
const {
  deviceType,
  curdeviceType,
  curdeviceListId,
  filteredDataList,
  DeviceStatus,
} = storeToRefs(deviceInfo);

// const scrollbar = ref<ScrollbarInst | null>(null);
// // 监听 curdeviceListId 的变化并滚动到对应项
// watch(curdeviceListId, async (newId) => {
//   await scrollbarTo(String(newId));
// });

// async function scrollbarTo(newId: string) {
//   // const { value: scrollbarInst } = scrollbar;
//   // const element = document.getElementById(newId); // 获取对应的设备元素
//   if (scrollbar.value) {
//     console.log("滚动到", scrollbar.value);
//     scrollbar.value.scrollTo({
//       top: 500, // 适当偏移
//       behavior: "smooth",
//     });
//   }
// }
</script>

<style scoped>
:deep(.n-tabs-tab__label) {
  @apply text-4;
}
:deep(.n-tabs-bar) {
  display: none;
}
:deep(.n-tabs .n-tabs-tab-pad) {
  @apply lt-laptop-(w-6);
}
.active {
  /* background: linear-gradient(0deg, #e3eeff, #e3eeff), #f5f9ff; */
  border: 2px solid #3563ef;
}
:deep(.n-tabs-pane-wrapper) {
  @apply h-full;
}
</style>
