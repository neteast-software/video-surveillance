<template>
  <!-- <DataFrame title="区域人流量" class="h-78"> -->
  <div class="h-0 flex-1">
    区域人流量
    <!-- <LineChart
      :source="source"
      y-axis-name="数量/"
      x-axis-name="/时间"
      :legend="legend"
    ></LineChart> -->
  </div>
  <!-- </DataFrame> -->
</template>

<script setup lang="ts">
import { reactive } from "vue";
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
  ["内部车辆", 70, 60, 70, 42, 40, 60, 80, 60, 36, 38, 60, 76],
  ["外部车辆", 30, 40, 30, 58, 60, 40, 20, 40, 64, 62, 40, 24],
];
const legend = reactive({
  right: 0,
});
</script>

<style scoped></style>
