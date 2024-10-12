<template>
  <div class="dataframe">
    <header class="flex justify-between">
      <h1>设备状态</h1>
      <div
        class="w-35 h-8 bg-#F6F6F7 border-(1 solid greyLine) rounded-7.5 flex cursor-pointer"
      >
        <div
          class="w-1/2 flex-center rounded-7.5 text-greyText transition"
          v-for="item in deviceType"
          :class="{ active: item.type === selectType }"
          @click="selectType = item.type"
        >
          {{ item.name }}
        </div>
      </div>
    </header>
    <div class="flex gap-4">
      <div class="blue-gradient p-5 pr-7.5 rounded-2 w-1/2">
        <div class="font-600 mb-3">今日设备状态</div>
        <div class="flex-col gap-3">
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
      <div class="blue-gradient p-5 rounded-2 w-1/2 flex-col relative">
        <div class="font-600 mb-5">整体在线率</div>
        <PieChart
          class="w-full flex-h-rest"
          :source="source"
          :legend="legend"
          :seriesOption="seriesOption"
        ></PieChart>
        <div class="absolute left-22 top-27 flex-(col center)">
          <div class="text-(primary 7.5) font-700">5656</div>
          总数
        </div>
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
  { name: "探头", type: "probe" },
  { name: "安全帽", type: "helmet" },
] as const;
const selectType = ref("probe");
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
  right: 40,
  top: "middle",
});
const seriesOption = reactive({
  radius: ["60%", "95%"],
  center: ["30%", "50%"],
});
</script>

<style scoped>
.active {
  @apply bg-primary text-white;
}
</style>
