<template>
  <div class="">
    <div class="flex justify-between mb-2 space-y-4 sm:space-y-0">
      <!-- <div class="flex flex-wrap items-center gap-2 text-xs">
        <span
          v-for="(range, index) in colorRanges"
          :key="index"
          class="flex items-center"
        >
          <span
            :class="[
              'w-3 h-3 inline-block mr-1 rounded',
              getColorClass(range.max),
            ]"
          ></span>
          <span class="text-[#232d42]">{{ range.min }}-{{ range.max }}</span>
        </span>
      </div> -->
    </div>
    <div class="grid grid-cols gap-1 mb-2">
      <div v-for="month in 6" :key="`month-${month}`" class="contents">
        <div class="text-right pr-2 text-[#86909c] text-sm">{{ month }}月</div>
        <div
          v-for="day in 31"
          :key="`${month}-${day}`"
          class="relative group"
          @mouseenter="showTooltip($event, month, day)"
          @mouseleave="hideTooltip"
        >
          <div
            :class="[
              'w-full pb-[100%] rounded',
              getColorClass(getData(month, day)),
            ]"
          ></div>
          <div
            v-show="
              tooltip.show && tooltip.month === month && tooltip.day === day
            "
            class="absolute z-10 bg-white p-2 rounded shadow-lg text-xs -mt-1 -ml-1 pointer-events-none"
          >
            <div class="font-semibold text-[#1d2129]">{{ tooltip.date }}</div>
            <div class="text-[#4e5969]">在线数量: {{ tooltip.value }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols gap-1">
      <div class="text-right pr-2"></div>
      <div
        v-for="day in 31"
        :key="`day-${day}`"
        class="text-xs text-center text-[#86909c]"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const activeRange = ref("all");
const timeRanges = {
  all: "在线趋势",
  "30days": "掉线次数",
};

const colorRanges = [
  { min: 0, max: 100 },
  { min: 100, max: 200 },
  { min: 200, max: 300 },
  { min: 300, max: 5000 },
  { min: 500, max: 1000 },
];

const tooltip = ref({
  show: false,
  month: null,
  day: null,
  date: "",
  value: 0,
});

const getColorClass = (value) => {
  if (value === 0) return "bg-[#f5f7fe]";
  if (value <= 100) return "bg-[#f0f5fd]";
  if (value <= 200) return "bg-[#d7e0fc]";
  if (value <= 300) return "bg-[#c3d1fb]";
  if (value <= 5000) return "bg-[#a4b9f8]";
  return "bg-[#86a1f5]";
};

const getData = (month, day) => {
  // Simulated data - replace with actual data fetching logic
  return Math.floor(Math.random() * 1000);
};

const showTooltip = (event, month, day) => {
  const value = getData(month, day);
  tooltip.value = {
    show: true,
    month,
    day,
    date: `2024-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`,
    value,
  };
};

const hideTooltip = () => {
  tooltip.value.show = false;
};
</script>

<style scoped>
/* UnoCSS custom utilities */
.grid-cols {
  grid-template-columns: auto repeat(31, minmax(0, 1fr));
}
</style>
