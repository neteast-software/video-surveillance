<template>
  <section
    class="py-6 overflow-hidden shadow-common rounded bg-base flex flex-col"
  >
    <header class="flex justify-between items-center px-6">
      <!-- <NPopselect v-model:value="filter" :options="options"><div></div></NPopselect> -->
      <!-- <PopSelect v-model:value="filter" :options="options"></PopSelect> -->
      <NRadioGroup
        class="flex-shrink-0"
        style="width: 200px"
        v-model:value="status"
      >
        <NSpace size="small">
          <NRadio value="">全部</NRadio>
          <NRadio :value="MonitorStatus.ONLINE">在线</NRadio>
          <NRadio :value="MonitorStatus.OFFLINE">离线</NRadio>
        </NSpace>
      </NRadioGroup>
      <NInput
        style="width: 200px; background: transparent"
        placeholder="请输入关键字"
        v-model:value="keyword"
      ></NInput>

      <!-- <div class="flex items-center">
                <NTooltip trigger="hover">
                    <template #trigger>
                        <i class="w-9 h-9 rounded flex-center border border-[#B5BCD4] mr-9 cursor-pointer laptop:mr-3">
                            <Icon :icon="ListIcon" class="w-5 h-5"></Icon>
                        </i>
                    </template>
                    <span>列表</span>
                </NTooltip>
                <NTooltip trigger="hover">
                    <template #trigger>
                        <i class="w-9 h-9 rounded flex-center border cursor-pointer border-[#B5BCD4]">
                            <Icon :icon="GridIcon" class="w-5 h-5"></Icon>
                        </i>
                    </template>
                    栅格
                </NTooltip>
            </div> -->
    </header>
    <header class="flex justify-between items-center px-6 gap-x-6">
      <!-- <PopSelect v-model:value="filter" :options="options" :width="200" placeholder="请选择nvr"></PopSelect> -->
      <NSelect
        style="width: 200px; background: transparent"
        :value="filter || undefined"
        :options="options"
        clearable
        placeholder="请选择nvr"
        @update:value="filter = $event"
      ></NSelect>
      <NSelect
        style="width: 200px; background: transparent"
        v-model:value="labels"
        :options="labelOptions"
        multiple
        max-tag-count="responsive"
        placeholder="请选择标签"
        clearable
      ></NSelect>
      <!-- <PopSelect :options="options" :width="200"></PopSelect> -->

      <!-- <NInput
                style="width: 200px; background: transparent"
                placeholder="请输入关键字"
                v-model:value="keyword"
            ></NInput> -->
    </header>
    <!-- <header class="px-6 flex">
        </header> -->
    <section class="h-0 flex-1">
      <NScrollbar>
        <main class="pb-6">
          <template v-for="nvr in filteredDeviceList" :key="nvr.id">
            <h2
              class="text-[#3D3D3D] dark:text-info mb-4 mt-6 mx-6 flex items-center"
            >
              <div
                class="w-2.5 h-2.5 rounded-full mr-2 offline"
                :class="{ online: nvr?.online }"
              ></div>
              {{ nvr.name }}
              <span class="ml-4">总路数: {{ nvr.channels?.length }}</span>
              <span class="ml-4"
                >在线路数:
                <span class="text-success">{{
                  calcOnlineCounts(nvr.channels)
                }}</span></span
              >
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
          </template>
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
  NRadioGroup,
  NRadio,
  NSpace,
  NSelect,
} from "naive-ui";
import MonitorCard from "./MonitorCard.vue";

import { computed, onMounted, ref } from "vue";
import {
  // getDevicesList,
  NVRItem,
  ChannelItem,
} from "../../utils/network/api/security";
import { useEventBus } from "@vueuse/core";
import { pickMonitorKey } from "./helper";
// import { MonitorItem } from "../../utils/network/types/security";
import { v4 as uuidv4 } from "uuid";
enum MonitorStatus {
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
const status = ref<MonitorStatus | "">("");
const labels = ref<string[]>([]);
const deviceList = ref<NVRItem[]>([]);

const filteredDeviceList = computed(() => {
  const f = filter.value;
  // if (!f) return deviceList.value;
  const tmp = deviceList.value.filter((nvr) => !f || nvr.id === f);
  // console.log(status.value);
  const selectStatus = status.value;
  const selectLabels = labels.value;
  console.log(selectStatus);
  // if (keyword.value) {
  return tmp
    .map((nvr) => {
      return {
        ...nvr,
        channels: nvr.channels?.filter((ch) => {
          console.log(
            "sdfskd",
            selectStatus
              ? selectStatus === MonitorStatus.ONLINE
                ? ch.online
                : !ch.online
              : true
          );
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

// async function initMonitorList() {
//   const { data } = await getDevicesList();
//   deviceList.value = data;
//   const limit = 4;
//   let len = 0;
//   const cache: MonitorItem[] = [];
//   const labelSet = new Set<string>();
//   data.forEach((nvr) => {
//     // if (len >= limit) return;
//     nvr.channels?.forEach((ch) => {
//       if (ch.labels) {
//         ch.labels.forEach((label) => {
//           labelSet.add(label);
//         });
//       }
//       if (len >= limit) return;
//       if (!ch.online) return;
//       if (!ch.online) return;
//       cache.push({
//         key: uuidv4(),
//         nvrId: nvr.id,
//         nvrName: nvr.name,
//         channelId: ch.channelNum,
//         channelName: ch.channelName,
//         online: ch.online,
//       });
//       len++;
//     });
//   });
//   options.value = [...data.map((nvr) => ({ label: nvr.name, value: nvr.id }))];
//   labelOptions.value = [...labelSet].map((label) => ({ label, value: label }));
//   monitorBus.emit(cache);
// }
// async function initData() {
//   initMonitorList();
// }
// onMounted(initData);

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
  @apply !bg-success;
}
.offline {
  @apply bg-[#707996];
}
:deep(.n-base-selection .n-base-selection-label) {
  background-color: transparent;
}
:deep(.n-base-selection .n-base-selection-tags) {
  background-color: transparent;
}
</style>
