<template>
  <Transition appear name="slideRight" class="z-999 fixed right-0 top-0 z-1">
    <div
      ref="detailsRef"
      class="flex-col bg-white h-full w-24% min-w-102 lt-laptop-(min-w-92) py-7.5"
    >
      <header class="flex-between mb-6 px-7.5 lt-laptop-(px-5)">
        <div class="text-5 font-600">设备详情</div>
        <div
          @click="showDetails = false"
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
          <div class="flex-w-rest ml-4 text-4.5 lt-laptop-(ml-2.5)">
            <div class="font-500 truncate">
              设备名称设备名称设备名称设备名称
            </div>
            <div
              class="flex-between text-(greyText 3.5) lt-laptop-(text-3 mt-2) h-11 mt-5"
            >
              <div class="flex-col flex-center">
                <div
                  class="text-(basic 4.5) font-700 flex-center lt-laptop-(text-3.5)"
                >
                  128h
                </div>
                在线时长
              </div>
              <div class="flex-col flex-center">
                <div
                  class="text-(basic 4.5) font-700 flex-center lt-laptop-(text-3.5)"
                >
                  1920*1080
                </div>
                分辨率
              </div>
              <div class="flex-col flex-center">
                <div
                  class="text-(basic 4.5) font-700 flex-center lt-laptop-(text-3.5)"
                >
                  H264
                </div>
                设备编码
              </div>
              <div class="flex-(col center) gap-2">
                <NTag
                  :bordered="false"
                  size="small"
                  :type="FilterStatus(3)"
                  class="lt-laptop-(text-2.5 p-1 h-4)"
                >
                  异常
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
          v-for="option in eventType"
          :name="option.id"
          :tab="option.label"
          class="h-full"
        >
          <div class="fill-parent relative">
            <NScrollbar ref="scrollbar" class="px-7.5 lt-laptop-(px-5)">
              <div
                class="w-full rounded-1 py-4 px-3 lt-laptop-(py-3 px-2) mb-3"
                :class="getClassByType(list.status)"
                v-for="list in lists"
              >
                <div class="flex-between mb-3 lt-laptop-(mb-2)">
                  <div class="flex-center gap-1">
                    <div
                      class="i-palette:alerts w-4 h-4"
                      :class="`i-palette:${list.status}`"
                    ></div>
                    <span class="text-greyText">{{ list.time }}</span>
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
                      {{ list.name }}
                    </div>
                    <div class="list-desc text-greyText lt-laptop-(text-3)">
                      {{ list.desc }}
                    </div>
                  </div>
                </div>
              </div>
            </NScrollbar>
            <!-- <div
                class="absolute left-1/2 -translate-x-1/2 mt-12 flex-col flex-center"
              >
                <img
                  src="../../assets/imgs/defaultImg.png"
                  class="w-75 h-75"
                  alt=""
                />
                <span class="text-greyText -mt-6"> 暂无数据 </span>
              </div> -->
          </div>
        </n-tab-pane>
      </NTabs>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { FilterStatus } from "@/utils/other/index";
import { NTag, NTabs, NTabPane, NScrollbar, NSelect } from "naive-ui";
import LineChart from "@/components/chart/LineChart.vue";
import { ref } from "vue";
// import { getClassByType } from "@/utils/other/index";
import { useMapInfoStore } from "@/stores/mapInfo";
import { storeToRefs } from "pinia";
import { onClickOutside } from "@vueuse/core";
const mapInfo = useMapInfoStore();
const { showDetails } = storeToRefs(mapInfo);
const source = [
  [
    "flow",
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  ["事件分类1", 12, 12, 8, 4, 8, 8, 8, 12, 12, 8, 8, 12, 16, 16],
];
const legend = ref({
  show: false,
});
const grid = ref({
  bottom: "15%",
  left: "5%",
  right: 0,
});
const selectlist = ref(); // 列表下拉框选中值
const curEventType = ref(0);
const eventType = ref([
  {
    id: 0,
    label: "全部",
  },
  {
    id: 1,
    label: "事件类型1",
  },
  {
    id: 2,
    label: "事件类型2",
  },
  {
    id: 3,
    label: "事件类型3",
  },
]);
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
const lists = ref([
  {
    time: "2024年10月10日 13：43",
    name: "这里显示的是事111件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "alerts",
  },
  {
    time: "2024年10月10日 13：43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "equip",
  },
  {
    time: "2024年10月10日 13：43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "noequip",
  },
  {
    time: "2024年10月10日 13：43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "equip",
  },
]);

function getClassByType(status: string) {
  switch (status) {
    case "alerts":
      return "bg-#FFF8EF";
    case "equip":
      return "bg-#F7FFFC";
    case "noequip":
      return "bg-#F5F9FF ";
    default:
      return "bg-#F7FFFC";
  }
}

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
</style>
