<template>
  <div class="dataframe">
    <header class="flex-center justify-between mb-4 lt-laptop-(mb-2)">
      <h1>设备状态</h1>
      <div
        class="w-56 h-8 bg-#F6F6F7 border-(1 solid greyLine) rounded-7.5 flex cursor-pointer"
      >
        <div
          class="w-1/3 flex-center rounded-7.5 text-greyText transition"
          v-for="item in deviceType"
          :class="{ active: item.type === selectType }"
          @click="selectType = item.type"
        >
          {{ item.name }}
        </div>
      </div>
    </header>
    <div class="flex gap-4 flex-h-rest">
      <div
        class="flex-col blue-gradient p-5 pr-7.5 rounded-2 w-1/2 min-w-85 lt-laptop-(p-3.5 pr-6 min-w-65)"
      >
        <div class="font-600 mb-3 lt-laptop-(mb-1.5)">今日设备状态</div>
        <div
          class="flex-col flex-h-rest justify-between max-h-50 lt-laptop-(gap-1)"
        >
          <div v-for="device in deviceStatus" class="flex-y-center gap-4">
            <div :class="`i-palette:${device.label} `" class="w-5 h-5"></div>
            <div class="flex-w-rest">
              <div class="flex-between mb-3">
                <span>{{ device.name }}</span>
                <span class="text-3 font-700">{{ device.value }}</span>
              </div>
              <NProgress
                type="line"
                :color="device.color"
                :rail-color="device.railColor"
                :percentage="device.percentage"
                :show-indicator="false"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="blue-gradient rounded-2 flex-w-rest min-w-70 flex-col relative"
      >
        <div class="font-600 p-5">整体在线率</div>
        <PieChart
          :source="source"
          :legend="legend"
          :seriesOption="seriesOption"
        ></PieChart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NProgress } from "naive-ui";
import { reactive, ref } from "vue";
import PieChart from "@/components/chart/PieChart.vue";
import { LegendComponentOption } from "echarts";

const deviceType = [
  { name: "全部", type: "all" },
  { name: "探头", type: "probe" },
  { name: "安全帽", type: "helmet" },
] as const;
const selectType = ref("all");
const deviceStatus = ref([
  {
    label: "devicescount",
    name: "设备数",
    value: 1212,
    percentage: 100,
    color: "#3563EF",
    railColor: "#DFEBFF",
  },
  {
    label: "online",
    name: "在线",
    value: 128,
    percentage: 60,
    color: "#4DC591",
    railColor: "#B6E7D3",
  },
  {
    label: "offline",
    name: "离线",
    value: 86,
    percentage: 30,
    color: "#8A92A6",
    railColor: "#CFD3DB",
  },
]);
const source = [
  ["在线", 80],
  ["异常", 20],
];
const legend = reactive<LegendComponentOption>({
  orient: "vertical",
  right: 30,
  top: "middle",
});
const seriesOption = reactive({
  radius: ["0", "90%"],
  center: ["40%", "50%"],
});
</script>

<style scoped>
.active {
  @apply bg-primary text-white;
}
</style>
