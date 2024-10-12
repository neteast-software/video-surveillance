<template>
  <div class="dataframe">
    <header class="flex justify-between">
      <h1>告警事件趋势</h1>
      <div
        class="w-56 h-8 bg-#F6F6F7 border-(1 solid greyLine) rounded-7.5 flex cursor-pointer"
      >
        <div
          class="w-1/3 flex-center rounded-7.5 text-greyText transition"
          v-for="item in dateMap"
          :class="{ active: item.value === selectType }"
          @click="selectType = item.value"
        >
          {{ item.label }}
        </div>
      </div>
    </header>
    <div class="flex-h-rest overflow-auto">
      <ResponsiveTrendChart></ResponsiveTrendChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ResponsiveTrendChart from "./ResponsiveTrendChart.vue";

const dateMap = [
  { label: "全部", value: "1" },
  { label: "近30天", value: "2" },
  { label: "近90天", value: "3" },
] as const;
const selectType = ref("1");
</script>

<style scoped>
.active {
  @apply bg-primary text-white;
}
</style>
