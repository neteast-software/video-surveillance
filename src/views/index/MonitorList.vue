<template>
  <section
    class="py-6 overflow-hidden h-full shadow-common flex flex-col max-w-430px"
  >
    <header class="flex justify-between items-center">
      <div class="w-full relative">
        <NButton
          type="primary"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 z-10"
          style="width: 52px; height: 26px"
          >搜索</NButton
        >
        <NInput
          style="width: 100%; background: transparent"
          placeholder="请输入关键字"
          v-model:value="keyword"
        >
          <template #prefix>
            <img src="../Icons/search.svg" alt="" />
          </template>
        </NInput>
      </div>
    </header>
    <header class="flex justify-between items-center gap-x-6">
      <NSelect
        style="width: 128px; background: transparent"
        :value="status || undefined"
        :options="statusOptions"
        placeholder="设备状态"
        @update:value="status = $event"
        clearable
      ></NSelect>
      <NSelect
        style="width: 128px; background: transparent"
        :value="filter || undefined"
        :options="options"
        placeholder="请选择nvr"
        @update:value="filter = $event"
        clearable
      ></NSelect>
      <NSelect
        style="width: 128px; background: transparent"
        v-model:value="labels"
        :options="labelOptions"
        multiple
        max-tag-count="responsive"
        placeholder="请选择标签"
        clearable
      ></NSelect>
    </header>
    <section class="h-0 flex-1">
      <NScrollbar>
        <main class="flex-col gap-3">
          <div
            v-for="nvr in filteredDeviceList"
            :key="nvr.id"
            class="border-(2 solid greyLine) rounded-1 py-4 px-3"
          >
            <h2 class="m-0 mb-4 flex-between text-4">
              {{ nvr.name }}({{ nvr.channels?.length }})
              <div class="flex gap-4">
                <div class="flex-center gap-1 text-#4DC591">
                  <div class="w-2.5 h-2.5 rounded-full bg-#4DC591"></div>
                  {{ nvr.channels?.filter((ch) => ch.online).length || 0 }}
                </div>
                <div class="flex-center gap-1 text-#707996">
                  <div class="w-2.5 h-2.5 rounded-full bg-#707996"></div>
                  {{ nvr.channels?.filter((ch) => !ch.online).length || 0 }}
                </div>
                <!-- <div class="flex-center gap-1 text-#EA6733">
                  <div class="w-2.5 h-2.5 rounded-full bg-#EA6733"></div>
                  10
                </div> -->
              </div>
            </h2>
            <section class="flex flex-wrap gap-5 mx-6">
              <template v-for="ch in nvr.channels" :key="ch.id">
                <MonitorCard
                  :nvr-name="nvr.name"
                  :monitor="ch"
                  @click="onPickMonitor(nvr.id, nvr.name, ch)"
                ></MonitorCard>
              </template>
            </section>
          </div>
        </main>
      </NScrollbar>
    </section>
  </section>
</template>

<script setup lang="ts">
import {
  NScrollbar,
  SelectOption,
  NInput,
  NButton,
  SelectRenderLabel,
  NRadioGroup,
  NRadio,
  NSpace,
  NSelect,
} from "naive-ui";
import MonitorCard from "./MonitorCard.vue";

import { computed, h, onMounted, ref } from "vue";
import {
  getDevicesList,
  NVRItem,
  ChannelItem,
} from "@/utils/network/api/security";
import { useEventBus } from "@vueuse/core";
import { pickMonitorKey } from "./helper";
import { MonitorItem } from "@/utils/network/types/security";
import { v4 as uuidv4 } from "uuid";
enum MonitorStatus {
  ALL = "all",
  ONLINE = "online",
  OFFLINE = "offline",
}
interface Props {
  regionId: number;
}
withDefaults(defineProps<Props>(), {});
defineEmits<{
  select: [indexCode: string];
}>();

const monitorBus = useEventBus(pickMonitorKey);

function onPickMonitor(nvrId: number, nvrName: string, ch: ChannelItem) {
  if (!ch.online) return;
  monitorBus.emit({
    key: uuidv4(),
    nvrId,
    nvrName,
    channelId: ch.channelNum,
    channelName: ch.channelName,
    online: ch.online,
  });
}

// watch(
//     () => props.regionId,
//     (newRegionId) => {
//         initMonitorList(newRegionId);
//     }
// );

// const layoutMode = ref<'list' | 'group'>('list');

const options = ref<SelectOption[]>([]);
const labelOptions = ref<SelectOption[]>([]);
const filter = ref<number | string>("");
const keyword = ref<string>("");
const status = ref<number | string>("");
const statusOptions = ref<SelectOption[]>([
  { label: "在线", value: MonitorStatus.ONLINE },
  { label: "离线", value: MonitorStatus.OFFLINE },
]);
const labels = ref<string[]>([]);
// const deviceList = ref<NVRItem[]>([]);
const deviceList = ref<NVRItem[]>([
  // {
  //   id: 1000016,
  //   name: "EPC-1北头岭隧道",
  //   online: false,
  //   channels: [
  //     {
  //       channelName: "北头岭兰花山隧道口",
  //       channelNum: "1",
  //       id: 106,
  //       imgAddr: "/static/capture/ffd8b5b24d6bfe8d279be9749e4570cd.jpg",
  //       labels: ["EPC-1", "隧道"],
  //       online: true,
  //       rtspPort: 554,
  //     },
  //     {
  //       channelName: "2#拌和站1#机皮带",
  //       channelNum: "2",
  //       id: 107,
  //       imgAddr: "/static/capture/29084d21f7c48497ed1a1261c00a8f9f.jpg",
  //       labels: ["EPC-1", "隧道"],
  //       online: false,
  //       rtspPort: 554,
  //     },
  //   ],
  // },
  // {
  //   id: 1000017,
  //   name: "EPC-1标2#拌合站",
  //   online: false,
  //   channels: [
  //     {
  //       channelName: "2#拌和站1#机配料机",
  //       channelNum: "1",
  //       id: 106,
  //       labels: ["EPC-1", "隧道"],
  //       online: true,
  //       rtspPort: 554,
  //     },
  //   ],
  // },
]);

const filteredDeviceList = computed(() => {
  const f = filter.value;
  const tmp = deviceList.value.filter((nvr) => !f || nvr.id === f);

  const selectStatus = status.value;
  const selectLabels = labels.value;
  // if (keyword.value) {
  return tmp
    .map((nvr) => {
      return {
        ...nvr,
        channels: nvr.channels?.filter((ch) => {
          return (
            (selectStatus
              ? selectStatus === MonitorStatus.ONLINE
                ? ch.online
                : !ch.online
              : true) &&
            (selectLabels.length
              ? haveCommonLabel(selectLabels, ch.labels || [])
              : true) &&
            ch.channelName.includes(keyword.value)
          );
        }),
      };
    })
    .filter((nvr) => nvr.channels?.length);
  // }
  // return tmp;
});

async function initMonitorList() {
  const { data } = await getDevicesList();
  deviceList.value = data;
  const limit = 4;
  let len = 0;
  const cache: MonitorItem[] = [];
  const labelSet = new Set<string>();
  deviceList.value.forEach((nvr) => {
    // if (len >= limit) return;
    nvr.channels?.forEach((ch) => {
      if (ch.labels) {
        ch.labels.forEach((label) => {
          labelSet.add(label);
        });
      }
      if (len >= limit) return;
      if (!ch.online) return;
      if (!ch.online) return;
      cache.push({
        key: uuidv4(),
        nvrId: nvr.id,
        nvrName: nvr.name,
        channelId: ch.channelNum,
        channelName: ch.channelName,
        online: ch.online,
      });
      len++;
    });
  });
  options.value = [
    ...deviceList.value.map((nvr) => ({ label: nvr.name, value: nvr.id })),
  ];
  labelOptions.value = [...labelSet].map((label) => ({ label, value: label }));
  monitorBus.emit(cache);
}
async function initData() {
  initMonitorList();
}
onMounted(initData);

function calcOnlineCounts(chs?: ChannelItem[] | null) {
  if (!chs) return 0;
  return chs.filter((ch) => ch.online).length;
}

function haveCommonLabel(arr1: string[], arr2: string[]) {
  return arr1.some((item) => arr2.includes(item));
}
</script>

<style scoped>
.online {
  @apply !bg-#4DC591;
}
.offline {
  @apply bg-#707996;
}
:deep(.n-base-selection .n-base-selection-label) {
  background-color: transparent;
}
:deep(.n-base-selection .n-base-selection-tags) {
  background-color: transparent;
}
:deep(.n-button:hover) {
  background-color: #4880ff;
}
:deep(.n-button:focus) {
  background-color: #3563ef;
}
</style>
