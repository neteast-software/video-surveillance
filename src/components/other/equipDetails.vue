<template>
  <Transition appear name="slideRight" class="z-999 fixed right-0 top-0 z-1">
    <NSpin
      :show="isLoading"
      class="h-full w-24% min-w-128 lt-laptop-(min-w-97) bg-white"
    >
      <div
        ref="detailsRef"
        class="flex-col h-full w-full py-7.5"
        v-show="curDetailId !== 0"
      >
        <header
          class="flex-between mb-6 px-7.5 text-5 lt-laptop-(px-5 text-4.5)"
        >
          <div class="font-600">设备详情</div>
          <div
            @click="curDetailId = 0"
            class="i-icons:close w-6 h-6 text-lightGrey cursor-pointer"
          ></div>
        </header>
        <main class="px-7.5 lt-laptop-(px-5)">
          <div class="flex-center mb-1">
            <img
              src="@/assets/imgs/text/listImg.png"
              class="w-25 h-22 lt-laptop-(w-18 h-15)"
              alt=""
            />
            <div class="flex-w-rest ml-4 text-4.5 lt-laptop-(ml-2.5 text-4)">
              <div class="font-500 truncate">
                {{ deviceDetail?.name }}
              </div>
              <div
                class="flex-between text-(greyText 3.5) lt-laptop-(text-3 mt-2) h-11 mt-5 overflow-hidden"
              >
                <div class="message">
                  <div class="label">{{ deviceDetail?.durationOnline }}h</div>
                  在线时长
                </div>
                <div class="message">
                  <div class="label">
                    {{ deviceDetail?.resolution }}
                  </div>
                  分辨率
                </div>
                <div class="message">
                  <div class="label">
                    {{ deviceDetail?.compression }}
                  </div>
                  设备编码
                </div>
                <div class="gap-2 message">
                  <NTag
                    :bordered="false"
                    size="small"
                    :type="FilterStatus(deviceDetail?.status!)"
                    class="lt-laptop-(text-2.5 p-1 h-4)"
                  >
                    {{ deviceDetail?.status }}
                  </NTag>
                  设备状态
                </div>
              </div>
            </div>
          </div>
          <LineChart
            :source="source"
            y-axis-name="在线/h"
            class="h-50"
            color="#4DC591"
            :legend="legend"
            :grid="grid"
          ></LineChart>
          <div
            class="w-full h-1px bg-greyLine mt-6 mb-7 lt-laptop-(mt-3 mb-4)"
          ></div>
        </main>

        <NTabs
          animated
          v-model:value="curEventType"
          :tabs-padding="30"
          class="flex-h-rest"
        >
          <template #suffix>
            <NSelect
              v-model:value="selectlist"
              class="w-26 text-4"
              :options="selectDatas"
              placeholder="预警等级"
            ></NSelect>
          </template>

          <n-tab-pane
            v-for="option in eventData"
            :name="option.id"
            :tab="option.label"
            class="h-full"
          >
            <div class="fill-parent relative">
              <NScrollbar
                ref="scrollbar"
                class="px-7.5 lt-laptop-(px-5)"
                v-if="filterLists.length !== 0"
              >
                <div
                  class="w-full rounded-1 py-4 px-3 lt-laptop-(py-3 px-2) mb-3"
                  :class="
                    eventType.find((item) => list.category === item.id)
                      ?.color || ''
                  "
                  v-for="list in filterLists"
                >
                  <div class="flex-between mb-3 lt-laptop-(mb-2)">
                    <div class="flex-center gap-1">
                      <div
                        class="i-palette:alerts w-4 h-4"
                        :class="`i-palette:${
                          eventType.find((item) => list.category === item.id)
                            ?.value || ''
                        }`"
                      ></div>
                      <span class="text-greyText">{{ list.happenTime }}</span>
                    </div>
                    <div class="i-icons:details rotate-90 w-3.5 h-3.5"></div>
                  </div>
                  <div class="flex-center gap-2">
                    <img
                      src="@/assets/imgs/text/build.png"
                      class="w-20 h-16 lt-laptop-(w-18 h-14)"
                      alt=""
                    />
                    <div class="flex-w-rest overflow-hidden">
                      <div class="text-4 lt-laptop-(text-3.5) truncate">
                        {{ list.title }}
                      </div>
                      <div class="list-desc text-greyText lt-laptop-(text-3)">
                        {{ list.content }}
                      </div>
                    </div>
                  </div>
                </div>
              </NScrollbar>
              <listEmpty v-else></listEmpty>
            </div>
          </n-tab-pane>
        </NTabs>
      </div>
    </NSpin>
  </Transition>
</template>

<script setup lang="ts">
import { FilterStatus } from "@/utils/other/data";
import { NTag, NTabs, NTabPane, NScrollbar, NSelect, NSpin } from "naive-ui";
import LineChart from "@/components/chart/LineChart.vue";
import listEmpty from "@/components/other/listEmpty.vue";
import { computed, ref, watch } from "vue";
import { useMapInfoStore } from "@/stores/mapInfo";
import { storeToRefs } from "pinia";
import { getDeviceDetail } from "@/utils/network/api/dashboard";
import type { DeviceDetail } from "@/utils/network/types/dashboard";
import { createLineChart } from "@/utils/other/create";
import { getAlarmList } from "@/utils/network/api/statusMonitor";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { AlarmList } from "@/utils/network/types/statusMonitor";
import { set } from "date-fns";
const mapInfo = useMapInfoStore();
const { curDetailId } = storeToRefs(mapInfo);

const source = ref<(number | string)[][]>([]);
const deviceDetail = ref<DeviceDetail>();
const alarmList = ref<AlarmList[]>([]);
const selectlist = ref(); // 列表下拉框选中值
const curEventType = ref("0"); // 当前事件类型
const isLoading = ref(false);
const deviceInfo = useDeviceInfoStore();
const { dataList, curdeviceListId } = storeToRefs(deviceInfo);
async function initDeviceDetail() {
  if (!curDetailId.value) return;
  const { data } = await getDeviceDetail(curDetailId.value, curData.value.type);
  deviceDetail.value = data;
  source.value = createLineChart(data.echartsData.dataBody);
}

//筛选dataList中对应curdeviceListId的数据
const curData = computed(() => {
  return dataList.value.filter((item) => item.id == curdeviceListId.value)[0];
});
const listParams = computed(() => {
  if (curEventType.value === "0")
    return {
      deviceId: curDetailId.value,
    };
  else {
    return {
      deviceId: curDetailId.value,
      category: curEventType.value,
    };
  }
});
async function initList() {
  const { data } = await getAlarmList(listParams.value);
  alarmList.value = data;
  console.log("alarmList", data);
}
function initData() {
  isLoading.value = true;
  try {
    initDeviceDetail();
    initList();
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 200);
  }
}
watch(() => curDetailId.value, initData);
watch(() => curEventType.value, initList);

const legend = ref({
  show: false,
});
const grid = ref({
  bottom: "15%",
  left: "5%",
  right: "5%",
});

const eventData = ref([
  {
    id: "0",
    label: "全部",
  },
  {
    id: "1",
    label: "事件类型1",
  },
  // {
  //   id: 2,
  //   label: "事件类型2",
  // },
  // {
  //   id: 3,
  //   label: "事件类型3",
  // },
]);
const eventType = [
  { id: 1, name: "离线", value: "noequip", color: "bg-#F5F9FF" },
  // { id: 2, name: "设备", value: "" },
  // { id: 3, name: "非设备", value: "" },
];
const selectDatas = ref([
  {
    label: "一般预警",
    value: "一般预警",
  },
  {
    label: "较重预警",
    value: "较重预警",
  },
  {
    label: "严重预警",
    value: "严重预警",
  },
  {
    label: "特别预警",
    value: "特别预警",
  },
]);
// const lists = ref([
//   {
//     time: "2024年10月10日 13：43",
//     name: "这里显示的是事111件名称事件名称",
//     desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
//     status: "alerts",
//     type: 1,
//   },
//   {
//     time: "2024年10月10日 13：43",
//     name: "这里显示的是事件名称事件名称",
//     desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
//     status: "equip",
//     type: 2,
//   },
//   {
//     time: "2024年10月10日 13：43",
//     name: "这里显示的是事件名称事件名称",
//     desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
//     status: "noequip",
//     type: 3,
//   },
//   {
//     time: "2024年10月10日 13：43",
//     name: "这里显示的是事件名称事件名称",
//     desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
//     status: "equip",
//     type: 2,
//   },
// ]);

const filterLists = computed(() => {
  if (!alarmList.value) return [];
  if (curEventType.value === "0") return alarmList.value;
  return alarmList.value.filter((item) => item.type === curEventType.value);
});

//点击外部关闭
// const detailsRef = ref<HTMLElement | null>(null); // 用于获取组件元素
// onClickOutside(detailsRef, () => {
//   showDetails.value = false;
//   console.log(showDetails.value);
// });
</script>

<style scoped>
:deep(.n-tabs-tab__label) {
  @apply text-4;
}
:deep(.n-tabs-bar) {
  display: none;
}
:deep(.n-tabs-scroll-padding) {
  width: 0 !important;
}
:deep(.n-tabs .n-tabs-nav) {
  @apply !px-7.5 !lt-laptop-(px-5);
}
:deep(.n-tabs .n-tabs-tab-pad) {
  @apply w-5;
}
:deep(.n-tabs-pane-wrapper) {
  @apply h-full;
}
.message {
  @apply flex-(col center);
  .label {
    @apply text-(basic 4.5) font-700 flex-center lt-laptop-(text-3.5);
  }
}
</style>
