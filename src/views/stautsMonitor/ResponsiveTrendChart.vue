<template>
  <div class="fill-parent flex-col gap-2">
    <div class="flex justify-between mb-5 space-y-4 lt-laptop-(mb-2)">
      <div class="flex gap-2">
        <button
          v-for="(label, range) in timeRanges"
          :key="range"
          @click="activeRange = range"
          class="px-4 py-1 rounded-md text-greyText transition"
          :class="
            activeRange === range
              ? 'bg-#3563ef text-white'
              : 'bg-#f6f6f7 border-(1px solid #eaeaea)'
          "
        >
          {{ label }}
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span
          v-for="(range, index) in colorRanges"
          :key="index"
          class="flex items-center"
        >
          <span
            :class="['w-3 h-3 inline-block mr-1 rounded']"
            :style="{
              background: getColorClass(range.max),
            }"
          ></span>
          <span class="text-[#232d42]">{{ range.min }}-{{ range.max }}</span>
        </span>
      </div>
    </div>
    <main class="flex-h-rest flex-col">
      <div class="grid grid-cols gap-1 mb-2">
        <div
          v-for="month in selectType === 1
            ? months.firsthalf
            : months.secondhalf"
          :key="`month-${month}`"
          class="contents"
        >
          <div class="text-right pr-2 text-greyText min-w-10">
            {{ month }}月
          </div>
          <div
            v-for="day in 31"
            :key="`${month}-${day}`"
            class="relative group"
          >
            <NPopover
              trigger="hover"
              placement="bottom-start"
              :show-arrow="false"
              style="padding: 8px"
            >
              <template #trigger>
                <div
                  class="w-full pb-[100%] rounded hover:scale-110 cursor-pointer"
                  :style="{
                    background: getColorClass(getData()),
                  }"
                ></div>
              </template>
              <div clas="w-40 text-3">
                <div class="text-#1D2129 font-600">
                  {{ currentYear }}-{{ month }}-{{ day }}
                </div>
                <div
                  class="p-1.5 bg-primary/20 rounded-1 flex-between gap-10 w-full"
                >
                  <span class="text-greyText">在线数量</span> {{ getData() }}
                </div>
              </div>
            </NPopover>
          </div>
        </div>
      </div>
      <div class="grid grid-cols gap-1">
        <div class="text-right pr-10"></div>
        <div
          v-for="day in 31"
          :key="`day-${day}`"
          class="text-xs text-center text-greyText"
        >
          {{ String(day).padStart(2, "0") }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NPopover } from "naive-ui";
interface Props {
  selectType?: number;
}
withDefaults(defineProps<Props>(), {
  selectType: 1,
});
const activeRange = ref("all");
const currentDate = ref(new Date()); // 当前日期
//本年
const currentYear = currentDate.value.getFullYear();
const timeRanges = {
  all: "在线趋势",
  disconCount: "掉线次数",
};
const colorRanges = [
  { min: 0, max: 100 },
  { min: 100, max: 200 },
  { min: 200, max: 300 },
  { min: 300, max: 5000 },
  { min: 500, max: 1000 },
];

const months = {
  firsthalf: [6, 5, 4, 3, 2, 1], // 前半年
  secondhalf: [12, 11, 10, 9, 8, 7], // 后半年
};

const getColorClass = (value: number) => {
  if (value === 0) return "rgba(53,99,239, 0.05)";
  if (value <= 100) return "rgba(53,99,239, 0.2)";
  if (value <= 200) return "rgba(53,99,239, 0.3)";
  if (value <= 300) return "rgba(53,99,239, 0.45)";
  if (value <= 5000) return "rgba(53,99,239, 0.6)";
  return "rgba(53,99,239, 0.05)";
};

function getData() {
  return Math.floor(Math.random() * 1000);
}
</script>

<style scoped>
.grid-cols {
  grid-template-columns: auto repeat(31, minmax(0, 1fr));
}
</style>
