<template>
  <div class="dataframe">
    <header class="flex justify-between">
      <h1>告警事件趋势</h1>
      <div
        class="w-35 h-8 bg-#F6F6F7 border-(1 solid greyLine) rounded-7.5 flex cursor-pointer"
      >
        <div
          class="w-1/2 flex-center rounded-7.5 text-greyText transition"
          v-for="item in dateMap"
          :class="{ active: item.value === selectType }"
          @click="selectType = item.value"
        >
          {{ item.label }}
        </div>
      </div>
    </header>
    <div class="flex-col h-full">
      <div class="flex gap-2">
        <button
          v-for="(label, range) in timeRanges"
          :key="range"
          @click="activeRange = range"
          :class="[
            'px-4 py-1 rounded-md text-greyText',
            activeRange === range
              ? 'bg-#3563ef text-white'
              : 'bg-#f6f6f7 border-(1px solid #eaeaea)',
          ]"
        >
          {{ label }}
        </button>
      </div>
      <!-- <heatChart
        :source="source"
        :xAxisData="xAxisData"
        :yAxisData="yAxisData"
        class="fill-parent"
      ></heatChart> -->
      <ResponsiveTrendChart></ResponsiveTrendChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ResponsiveTrendChart from "./ResponsiveTrendChart.vue";
import heatChart from "@/components/chart/heatChart.vue";

const dateMap = [
  { label: "全部", value: "1" },
  { label: "近90天", value: "3" },
] as const;
const selectType = ref("1");
const activeRange = ref("all");
const timeRanges = {
  all: "在线趋势",
  "30days": "掉线次数",
};
// const xAxisData = [
//   "1",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "9",
//   "10",
//   "11",
//   "12",
//   "13",
//   "14",
//   "15",
//   "16",
//   "17",
//   "18",
//   "19",
//   "20",
//   "21",
//   "22",
//   "23",
//   "24",
//   "25",
//   "26",
//   "27",
//   "28",
//   "29",
//   "30",
// ];
const yAxisData = ["1月", "2月", "3月", "4月", "5月", "6月"];
// const source = [[0, 1, 10]];
// const source = [
//   // 第 1 行是列名
//   ["月/日", ...xAxisData],
//   // 其他行是数据
//   [
//     "1月",
//     0,
//     1,
//     10,
//     20,
//     30,
//     40,
//     50,
//     60,
//     70,
//     80,
//     90,
//     100,
//     110,
//     120,
//     130,
//     140,
//     150,
//     160,
//     170,
//     180,
//     190,
//     200,
//     210,
//     220,
//     230,
//     240,
//     250,
//     260,
//     270,
//     280,
//   ],
//   [
//     "2月",
//     5,
//     15,
//     25,
//     35,
//     45,
//     55,
//     65,
//     75,
//     85,
//     95,
//     105,
//     115,
//     125,
//     135,
//     145,
//     155,
//     165,
//     175,
//     185,
//     195,
//     205,
//     215,
//     225,
//     235,
//     245,
//     255,
//     265,
//     275,
//     285,
//     295,
//   ],
//   [
//     "3月",
//     10,
//     20,
//     30,
//     40,
//     50,
//     60,
//     70,
//     80,
//     90,
//     100,
//     110,
//     120,
//     130,
//     140,
//     150,
//     160,
//     170,
//     180,
//     190,
//     200,
//     210,
//     220,
//     230,
//     240,
//     250,
//     260,
//     270,
//     280,
//     290,
//     300,
//   ],
//   [
//     "4月",
//     0,
//     2,
//     4,
//     6,
//     8,
//     10,
//     12,
//     14,
//     16,
//     18,
//     20,
//     22,
//     24,
//     26,
//     28,
//     30,
//     32,
//     34,
//     36,
//     38,
//     40,
//     42,
//     44,
//     46,
//     48,
//     50,
//     52,
//     54,
//     56,
//     58,
//   ],
//   [
//     "5月",
//     20,
//     30,
//     40,
//     50,
//     60,
//     70,
//     80,
//     90,
//     100,
//     110,
//     120,
//     130,
//     140,
//     150,
//     160,
//     170,
//     180,
//     190,
//     200,
//     210,
//     220,
//     230,
//     240,
//     250,
//     260,
//     270,
//     280,
//     290,
//     300,
//     310,
//   ],
//   [
//     "6月",
//     5,
//     15,
//     25,
//     35,
//     45,
//     55,
//     65,
//     75,
//     85,
//     95,
//     105,
//     115,
//     125,
//     135,
//     145,
//     155,
//     165,
//     175,
//     185,
//     195,
//     205,
//     215,
//     225,
//     235,
//     245,
//     255,
//     265,
//     275,
//     285,
//     295,
//   ],
// ];
</script>

<style scoped>
.active {
  @apply bg-primary text-white;
}
</style>
