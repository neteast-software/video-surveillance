<template>
  <div class="dataframe">
    <header class="flex-y-center justify-between mb-4 lt-laptop-(mb-2)">
      <h1>历史事件列表</h1>
      <!-- <div class="i-icons:filter w-6 h-6 cursor-pointer"></div> -->
    </header>
    <div class="flex gap-3">
      <div
        class="w-18 bg-#F5F9FF rounded-1 text-greyText flex-center cursor-pointer transition"
        :class="{ 'bg-primary text-white': index === clickSelect }"
        @click="clickSelect = index"
        v-for="(data, index) in selectData"
      >
        {{ data }}
      </div>
    </div>
    <LineChart :source="source" class="h-60"></LineChart>
    <div class="w-full h-1px bg-greyLine my-4"></div>
    <div>
      <header class="flex-y-center justify-between font-600">
        <div class="flex-center gap-2">
          2024年10月
          <div class="i-icons:date w-4 h-4 text-greyText"></div>
        </div>
        <span class="cursor-pointer text-primary" @click="backToday = true"
          >今日</span
        >
      </header>
      <Calendar
        :back-today="backToday"
        @back-today="backToday = $event"
      ></Calendar>
    </div>
    <div class="flex-col gap-2.5 flex-h-rest mt-2 overflow-auto">
      <div
        class="w-full rounded-1 py-3.5 px-3 lt-laptop-(py-3 px-2)"
        :class="getClassByType(list.status)"
        v-for="list in lists"
      >
        <div class="flex-center gap-2">
          <img
            src="@/assets/imgs/text/build.png"
            class="w-20 h-16 lt-laptop-(w-18 h-14)"
            alt=""
          />
          <div class="flex-w-rest overflow-hidden">
            <div class="text-4 lt-laptop-(text-3.5) flex-y-center gap-1">
              <div class="flex-(y-center w-rest) gap-1">
                <div
                  class="i-palette:alerts w-4 h-4"
                  :class="`i-palette:${list.status}`"
                ></div>
                <div class="truncate flex-w-rest">{{ list.name }}</div>
              </div>
              <span class="text-(3 greyText)">13:43</span>
            </div>
            <div class="list-desc text-greyText lt-laptop-(text-3)">
              {{ list.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/chart/LineChart.vue";
import Calendar from "@/components/Calendar.vue";
import { ref } from "vue";
// import { getClassByType } from "@/utils/other/index";

const backToday = ref(false);
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
  ["事件分类1", "-", "-", "-", "-", "-", 60, 80, 60, 36, 38, 60, 76],
  ["事件分类2", 30, 40, 30, 58, 20, 40, 20, 40, "-", "-", "-", 24],
  ["事件分类3", "-", "-", "-", "-", "-", "-", "-", 40, 64, 20, 3, 0],
  ["事件分类4", "-", "-", "-", 20, 15, 18, "-", "-", "-", 62, 40, 24],
];
const selectData = ["全部", "监控", "安全帽"];
const clickSelect = ref(0);
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
    status: "noequip",
  },
  {
    time: "2024年10月10日 13：43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "noequip",
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
</script>

<style scoped>
.list-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 单行文本 */
}


</style>
