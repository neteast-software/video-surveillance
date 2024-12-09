<template>
  <section class="relative h-full">
    <template v-if="monitorList.length">
      <draggable
        :disabled="gridCount === 1"
        class="w-full h-full"
        :class="[`grid-${gridCount}`, { fullscreen: isFullscreen }]"
        group="monitor"
        item-key="key"
        v-model="monitorList"
      >
        <template #item="{ element: item, index }">
          <Monitor
            :is-fullscreen="isFullscreen"
            :id="item.key"
            :controls="gridCount === 1"
            :nvr-id="item.nvrId"
            :nvr-name="item.nvrName"
            :channel-id="item.channelId"
            :ch-name="item.channelName"
            :channel-num="item.channelNum"
            @dblclick="pickMonitor(index)"
            @contextmenu.prevent="delMonitor(index)"
          >
            <template #right>
              <NPopover
                style="background-color: rgba(0, 0, 0)"
                arrow-style="background-color: rgba(0, 0, 0)"
              >
                <template #trigger>
                  <ControlButton :icon="grid">布局</ControlButton>
                </template>
                <div class="flex-center gap-x-3">
                  <button
                    class="flex-center w-13 h-8 rounded-full text-white z-50 bg-black/50"
                    v-for="grid in gridOptions"
                    @click="gridCount = grid.num"
                    :class="{ 'bg-primary': gridCount === grid.num }"
                  >
                    <Icon :icon="grid.icon" width="20"></Icon>
                  </button>
                </div>
              </NPopover>
            </template>
            <div
              v-show="gridCount !== 1"
              class="w-full h-full absolute left-0 top-0 mask"
            ></div>
          </Monitor>
        </template>
      </draggable>
    </template>
    <template v-else>
      <Monitor
        id=""
        :nvr-id="0"
        :channel-id="0"
        nvr-name=""
        ch-name=""
        :channel-num="0"
      ></Monitor>
    </template>
    <!-- v-motion-slide-bottom -->
    <MonitorSlider
      ref="historyBar"
      v-on-click-outside="() => (showHistory = false)"
      v-if="showHistory"
      class="absolute bottom-0 left-0 w-full z-50"
    ></MonitorSlider>
    <div
      class="flex-center gap-x-3 absolute top-3.5 right-4"
      v-show="gridCount !== 1"
    >
      <button
        class="flex-center w-13 h-8 rounded-full text-white z-50 bg-black/50"
        v-for="grid in gridOptions"
        @click="gridCount = grid.num"
        :class="{ 'bg-primary': gridCount === grid.num }"
      >
        <Icon :icon="grid.icon" width="20"></Icon>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import Monitor from "./Monitor.vue";
import MonitorSlider from "./MonitorSlider.vue";
import { computed, ref, onMounted, watch } from "vue";
import { NPopover } from "naive-ui";
import { Icon } from "@iconify/vue";
import grid from "@/assets/icons/grid";
import grid4 from "@/assets/icons/grid4";
import grid9 from "@/assets/icons/grid9";
import grid1 from "@/assets/icons/grid1";
import { vOnClickOutside } from "@vueuse/components";
import { MonitorItem } from "@/utils/network/types/security";
import { pickMonitorKey } from "./helper";
import { useEventBus, useDebounceFn } from "@vueuse/core";
import draggable from "vuedraggable";
import { isEmptyObject } from "@/utils/other";
import { useDialogAsync } from "@/components/dialog";
import ControlButton from "@/components/video/ControlButton.vue";
interface Props {
  isFullscreen: boolean;
  activeMonitor: number;
  deviceId: number;
}
const props = withDefaults(defineProps<Props>(), {
  isFullscreen: false,
});
const emit = defineEmits(["update:activeMonitor"]);
const { confirmDialog } = useDialogAsync();
const gridOptions = [
  { num: 4, icon: grid4 },
  { num: 9, icon: grid9 },
  { num: 1, icon: grid1 },
];
const gridCount = ref(4);
const sourceList = ref<MonitorItem[]>([]);
const monitorList = computed({
  get() {
    const total = sourceList.value.length;
    const count = gridCount.value;
    const gap = count - total < 0 ? 0 : count - total;
    return sourceList.value.slice(0, count).concat(new Array(gap).fill({}));
  },
  set(newList) {
    const l = newList.filter((item) => !isEmptyObject(item));
    sourceList.value.splice(0, l.length, ...l);
  },
});
watch(monitorList, (val) => {
  console.log("monitorList改变", val);
});
function pickMonitor(index: number) {
  const item = sourceList.value.splice(index, 1)[0];
  if (!item) return;
  sourceList.value.unshift(item);
  gridCount.value = 1;
  emit("update:activeMonitor", item.channelId);
}

async function delMonitor(index: number) {
  await confirmDialog({
    title: "删除监控",
    content: "确定要删除该监控吗?",
  });
  sourceList.value.splice(index, 1);
}

// 历史回放
const showHistory = ref(false);
const addMonitorLock = useDebounceFn(addMonitor, 200);
async function addMonitor(monitor: MonitorItem | MonitorItem[]) {
  // sourceList.value.unshift({ indexCode } as unknown as MonitorItem);
  // const { data } = await getMonitorInfo(indexCode);
  // // sourceList.value.unshift(data);
  // const idx = sourceList.value.findIndex((item) => item.indexCode === indexCode);
  // sourceList.value.splice(idx, 1, data);
  // console.log('新增显示器data', data, sourceList.value);
  if (Array.isArray(monitor)) {
    sourceList.value.unshift(...monitor);
    return;
  }
  sourceList.value.unshift(monitor);
}
const monitorBus = useEventBus(pickMonitorKey);
monitorBus.on(addMonitorLock);

onMounted(() => {});
watch(
  () => props.deviceId,
  (val) => {
    console.log("deviceId", val);
    if (val) {
      gridCount.value = 1;
    }
  }
);
</script>

<style scoped>
.grid-4 {
  @apply grid grid-cols-2 grid-rows-2 gap-1;
}
.grid-9 {
  @apply grid grid-cols-3 grid-rows-3 gap-1;
}
.fullscreen {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.mask:hover {
  border: 4px solid #4dc591;
  /* background: radial-gradient(
      70% 70% at 50% 50%,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 89%,
      #ffffff 100%
    ),
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0) 16%,
      rgba(0, 0, 0, 0) 82%,
      rgba(0, 0, 0, 0.2) 100%
    ); */
}
</style>
