<template>
  <div class="dataframe relative">
    <div class="text-4 font-600">设备类型告警数量</div>
    <PieChart class="w-full" :source="source"></PieChart>
  </div>
</template>

<script setup lang="ts">
import PieChart from "@/components/chart/PieChart.vue";
const source = [
  ["监控", 80],
  ["探头", 20],
];
</script>

<style scoped></style>
