<template>
  <div class="dataframe">
    <header class="flex-y-center justify-between mb-4 lt-laptop-(mb-2)">
      <h1>{{ listTitle }}</h1>
      <!-- <div class="i-icons:filter w-6 h-6 cursor-pointer"></div> -->
    </header>
    <div class="flex gap-3">
      <div
        class="w-18 bg-#F5F9FF rounded-1 text-greyText flex-center cursor-pointer transition"
        :class="{ 'bg-primary text-white': device.id === curdeviceType }"
        @click="curdeviceType = device.id"
        v-for="device in deviceType"
      >
        {{ device.name }}
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
    <div class="relative flex-h-rest">
      <Transition appear name="slideBottom" v-if="alarmList.length > 0">
        <div class="flex-col gap-2.5 h-full mt-2 overflow-auto transition">
          <div
            class="w-full rounded-1 py-3.5 px-3 lt-laptop-(py-3 px-2)"
            :class="
              eventType.find((item) => list.category === item.id)?.color || ''
            "
            v-for="list in alarmList"
          >
            <div class="flex-center gap-2">
              <img v-if="list.img" src="" alt="" />
              <img
                v-else
                src="@/assets/imgs/text/build.png"
                class="w-20 h-16 lt-laptop-(w-18 h-14)"
                alt=""
              />
              <div class="flex-w-rest overflow-hidden">
                <div class="text-4 lt-laptop-(text-3.5) flex-y-center gap-1">
                  <div class="flex-(y-center w-rest) gap-1">
                    <div
                      class="i-palette:alerts w-4 h-4"
                      :class="`i-palette:${
                        eventType.find((item) => list.category === item.id)
                          ?.value || ''
                      }`"
                    ></div>
                    <div class="truncate flex-w-rest">{{ list.title }}</div>
                  </div>
                  <span class="text-(3 greyText)">{{
                    list.happenTime.split(" ")[1].slice(0, 5)
                  }}</span>
                </div>
                <div class="list-desc text-greyText lt-laptop-(text-3)">
                  {{ list.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <listEmpty v-else class="!mt-0"></listEmpty>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineChart from "@/components/chart/LineChart.vue";
import Calendar from "@/components/Calendar.vue";
import listEmpty from "@/components/other/listEmpty.vue";
import { computed, onMounted, ref, watch } from "vue";
import { NDatePicker } from "naive-ui";
import { deviceType } from "@/utils/other/data";
import {
  getHistoryEvent,
  getHasAlarmByDate,
  getAlarmList,
} from "@/utils/network/api/statusMonitor";
import type { AlarmList } from "@/utils/network/types/statusMonitor";

// import "v-calendar/style.css";
// import { DatePicker } from "v-calendar";
import { format } from "date-fns";
import { getMonday, getSunday } from "@/utils/other/calendar";

const timestamp = ref(new Date().getTime()); // 当前时间戳
const clickDate = computed(() =>
  format(new Date(timestamp.value), "yyyy-MM-dd")
);
const backToday = ref(false);
const curdeviceType = ref(0);

const listTitle = ref("历史事件列表");
const source = ref<(number | string)[][]>([]);
const alarmList = ref<AlarmList[]>([]);
async function initsource() {
  const { data } = await getHistoryEvent(curdeviceType.value, 1);
  console.log("getHistoryEvent", data);
  listTitle.value = data?.dataBody.title;
  // const title = data?.dataBody.title || "";
  const dataList = data?.dataBody.dataList || [];
  const xAxis = data?.dataBody.abscissa || [];
  const xAxisDays = xAxis.map((date) => date.split("-")[2]);
  const items = dataList.map((item) =>
    Array.isArray(item.value)
      ? [item.name, ...item.value]
      : [item.name, item.value]
  );
  source.value = [["日期", ...xAxisDays], ...items];
  if (!xAxis.length) {
    const names = dataList.map((item) => item.name);
    const values = dataList.map((item) => item.value);
    source.value = [
      ["日期", ...names],
      ["数量", ...(values as number[])],
    ];
  }
}
watch(() => curdeviceType.value, initsource);

const params = computed(() => {
  const startDay = format(getMonday(new Date(timestamp.value)), "yyyy-MM-dd");
  const endDay = format(getSunday(new Date(timestamp.value)), "yyyy-MM-dd");
  return { startDay, endDay };
});
const events = ref();
async function initCalendar() {
  const { data } = await getHasAlarmByDate(
    params.value.startDay,
    params.value.endDay
  );
  events.value = data;
}
watch(
  () => [params.value.startDay, params.value.endDay],
  (newValues, oldValues) => {
    if (!oldValues) return initCalendar();
    if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
      initCalendar();
    }
  }
);

async function initList() {
  const { data } = await getAlarmList({ happenTime: clickDate.value });
  alarmList.value = data;
}
watch(() => timestamp.value, initList);
function initData() {
  initsource();
  initCalendar();
  initList();
}
onMounted(initData);

const eventType = [
  { id: 1, name: "离线", value: "noequip", color: "bg-#F5F9FF" },
  // { id: 2, name: "设备", value: "" },
  // { id: 3, name: "非设备", value: "" },
];
const lists = ref([
  {
    data: "2024-10-1",
    time: "13:43",
    name: "这里显示的是事111件名称事件名称",
    desc: "这里显示的是该事件简介描述这里显示的是该事件简介描述这里显示的是该事件简介描述",
    status: "alerts",
  },
  {
    data: "2024-10-1",
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

const disablePreviousDate = (ts: number) => {
  return ts > Date.now();
};
// function getClassByType(status: string) {
//   switch (status) {
//     case "alerts":
//       return "bg-#FFF8EF";
//     case "equip":
//       return "bg-#F7FFFC";
//     case "noequip":
//       return "bg-#F5F9FF ";
//     default:
//       return "bg-#F7FFFC";
//   }
// }
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
