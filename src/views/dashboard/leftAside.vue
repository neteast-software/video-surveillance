<template>
  <Transition appear name="slideLeft">
    <div class="flex-col gap-4 h-full w-24% min-w-102 lt-laptop-(min-w-92)">
      <header class="bg-white w-full rounded-2px py-6">
        <div class="mx-6 flex justify-between lt-laptop-(mx-3)">
          <div v-for="option in options" class="flex-center">
            <img
              :src="option.icon"
              alt=""
              class="w-7 h-7 lt-laptop-(w-7 h-7)"
            />
            <div class="ml-2 tracking-normal lt-laptop-(text-3)">
              {{ option.label }}
              <div
                class="text-6 font-700 leading-7.5 mt-1 overflow-hidden lt-laptop-(text-6)"
              >
                {{ option.value || 0 }}
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
            <deviceList></deviceList>
          </n-tab-pane>
        </NTabs>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { NTabs, NTabPane } from "naive-ui";
import deviceList from "./deviceList.vue";
import totelIcon from "@/assets/svgs/total.svg";
import onlineIcon from "@/assets/svgs/online.svg";
import exceptionIcon from "@/assets/svgs/abnormal.svg";
import OfflineIcon from "@/assets/svgs/Offline.svg";
// import { options } from "./data";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
import { getOnlineStatistics } from "@/utils/network/api/dashboard";

const deviceInfo = useDeviceInfoStore();
const { deviceType, curdeviceType } = storeToRefs(deviceInfo);
const { initAllDevices } = deviceInfo;

const OnlineStatistics = ref<any>(null);
async function initData() {
  const { data } = await getOnlineStatistics();
  if (!data) return;
  OnlineStatistics.value = data;
}
onMounted(() => {
  initAllDevices();
  initData();
});
const options = computed(() => {
  return [
    {
      label: "总数",
      value: OnlineStatistics.value?.total,
      icon: totelIcon,
    },
    {
      label: "在线",
      value: OnlineStatistics.value?.online,
      icon: onlineIcon,
    },
    {
      label: "异常",
      value: OnlineStatistics.value?.exception,
      icon: exceptionIcon,
    },
    {
      label: "离线",
      value: OnlineStatistics.value?.offline,
      icon: OfflineIcon,
    },
  ];
});
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

:deep(.n-tabs-pane-wrapper) {
  @apply h-full;
}
</style>
