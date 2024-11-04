<template>
  <div class="dataframe">
    <header class="flex-center justify-between mb-4 lt-laptop-(mb-2)">
      <h1>设备状态</h1>
      <div class="w-56 h-8 bg-#F5F9FF rounded-7.5 flex cursor-pointer">
        <div
          class="w-1/3 flex-center rounded-7.5 text-greyText transition"
          v-for="item in deviceType"
          :class="{ active: item.id === selectType }"
          @click="selectType = item.id"
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
          class="flex-col flex-h-rest justify-between max-h-50 gap-2 lt-laptop-(gap-1)"
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
                :percentage="device.value"
                :show-indicator="false"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="blue-gradient rounded-2 flex-w-rest min-w-70 flex-col relative"
      >
        <div class="font-600 pl-5 pt-5">{{ title }}</div>
        <div class="fill-parent relative">
          <PieChart
            :source="source"
            :legend="legend"
            :seriesOption="seriesOption"
            :title="pieTitle"
          ></PieChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NProgress } from "naive-ui";
import { computed, onMounted, reactive, ref, watch } from "vue";
import PieChart from "@/components/chart/PieChart.vue";
import { LegendComponentOption } from "echarts";
import { getDeviceStatus } from "@/utils/network/api/statusMonitor";
import type { DeviceStatus } from "@/utils/network/types/statusMonitor";
import type { PieSource } from "@/components/chart/PieChart.vue";
import { deviceType } from "@/utils/other/data";
const deviceData = ref<DeviceStatus>();
const source = ref<PieSource>([]);
const title = ref("整体在线率");
const isSmallScreen = window.innerHeight < 1000;

async function initData() {
  const { data } = await getDeviceStatus(selectType.value);
  console.log(data);
  deviceData.value = data;
  const dataBody = data.chartData.dataBody;
  title.value = dataBody.title;
  source.value = dataBody.dataList || [];
}
onMounted(initData);

const selectType = ref("0");
watch(() => selectType.value, initData);

const deviceStatus = computed(() => [
  {
    label: "devicescount",
    name: "设备数",
    value: deviceData.value?.total || 0,
    color: "#3563EF",
    railColor: "#DFEBFF",
  },
  {
    label: "online",
    name: "在线",
    value: deviceData.value?.online || 0,
    color: "#4DC591",
    railColor: "#B6E7D3",
  },
  {
    label: "offline",
    name: "离线",
    value: deviceData.value?.offline || 0,
    color: "#8A92A6",
    railColor: "#CFD3DB",
  },
]);
const legend = reactive<LegendComponentOption>({
  orient: "vertical",
  right: "10%",
  top: "middle",
});
const seriesOption = computed(() => {
  return {
    center: ["30%", "50%"],
    radius: isSmallScreen ? ["60%", "80%"] : ["60%", "80%"],
  };
});
const pieTitle = computed(() => {
  //求在线率
  const online = source.value.find((item) => item.name === "在线")?.value || 0;
  const totalCount = source.value.reduce((acc, item) => acc + item.value, 0);
  const onlineRate =
    totalCount > 0 ? ((online / totalCount) * 100).toFixed(0) + "%" : "0%";
  return {
    show: true,
    text: onlineRate,
    subtext: "在线率",
    left: isSmallScreen ? "28%" : "28%",
    top: isSmallScreen ? "36%" : "40%",
    textAlign: "center",
    itemGap: 5,
    textStyle: {
      fontSize: isSmallScreen ? 24 : 30,
      color: "#3563EF",
      fontWeight: "bold",
    },
    subtextStyle: {
      fontSize: 14,
    },
  };
});
</script>

<style scoped>
.active {
  @apply bg-primary text-white;
}
</style>
