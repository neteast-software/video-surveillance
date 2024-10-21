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
        <NDatePicker
          :is-date-disabled="disablePreviousDate"
          v-model:value="timestamp"
          format="yyyy年MM月dd"
          type="date"
          style="width: 150px"
        />
        <span
          class="cursor-pointer text-primary"
          :class="{ 'text-primary/20': timestamp >= Date.now() }"
          @click="backToday = true"
          >今日</span
        >
      </header>
      <Calendar
        :back-today="backToday"
        @back-today="backToday = $event"
        v-model:timestamp="timestamp"
        :events="events"
      ></Calendar>
    </div>
    <Transition appear name="slideBottom">
      <div class="relative flex-h-rest">
        <div
          class="flex-col gap-2.5 h-full mt-2 overflow-auto transition"
          v-if="filterLists.length > 0"
        >
          <div
            class="w-full rounded-1 py-3.5 px-3 lt-laptop-(py-3 px-2)"
            :class="getClassByType(list.status)"
            v-for="list in filterLists"
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
                  <span class="text-(3 greyText)">{{ list.time }}</span>
                </div>
                <div class="list-desc text-greyText lt-laptop-(text-3)">
                  {{ list.desc }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <listEmpty v-else></listEmpty>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/chart/LineChart.vue";
import Calendar from "@/components/Calendar.vue";
import listEmpty from "@/components/other/listEmpty.vue";
import { computed, ref } from "vue";
import { NDatePicker } from "naive-ui";
// import "v-calendar/style.css";
// import { DatePicker } from "v-calendar";

import { format } from "date-fns";
const timestamp = ref(new Date().getTime()); // 当前时间戳

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
    data: "2024-10-21",
    time: "13:43",
    name: "这里显示的是事111件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "alerts",
  },
  {
    data: "2024-10-21",
    time: "13:43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "equip",
  },
  {
    data: "2024-10-21",
    time: "13:43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "noequip",
  },
  {
    data: "2024-10-21",
    time: "13:43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "noequip",
  },
  {
    data: "2024-10-21",
    time: "13:43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "noequip",
  },
  {
    data: "2024-10-17",
    time: "13:43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "noequip",
  },
  {
    data: "2024-10-14",
    time: "13:43",
    name: "这里显示的是事件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "noequip",
  },
]);

const filterLists = computed(() => {
  if (!lists.value) return [];
  const date = format(new Date(timestamp.value), "yyyy-MM-dd");
  return lists.value.filter((item) => item.data === date);
});

const events = computed(() => {
  const addedEvents: Record<string, boolean> = {};
  return lists.value.reduce<{ date: string; status: string }[]>((acc, item) => {
    const key = `${item.data}-${item.status}`;
    if (item.status && !addedEvents[key]) {
      addedEvents[key] = true;
      acc.push({ date: item.data, status: item.status });
    }
    return acc;
  }, []);
});

const disablePreviousDate = (ts: number) => {
  return ts > Date.now();
};
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
:deep(.n-input .n-input__border, .n-input .n-input__state-border),
:deep(.n-input .n-input__state-border) {
  display: none;
}
:deep(.n-input .n-input__input-el) {
  font-size: 16px;
}
</style>
