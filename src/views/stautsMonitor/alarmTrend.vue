<template>
  <div class="dataframe">
    <header class="flex justify-between">
      <h1>告警事件趋势</h1>
      <div
        class="h-8 bg-#F6F6F7 border-(1 solid greyLine) rounded-7.5 flex cursor-pointer"
      >
        <div
          class="flex-center rounded-7.5 text-greyText transition px-4"
          v-for="item in dateMap"
          :class="{ active: item.value === selectType }"
          @click="selectType = item.value"
        >
          {{ item.label }}
        </div>
      </div>
    </header>
    <div class="flex-col h-full mt-3 lt-laptop-(mt-1)">
      <ResponsiveTrendChart :selectType="selectType"></ResponsiveTrendChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ResponsiveTrendChart from "./ResponsiveTrendChart.vue";

const dateMap = [
  { label: "上半年", value: 1 },
  { label: "下半年", value: 2 },
] as const;
const selectType = ref(1);
</script>

<style scoped>
.active {
  @apply bg-primary text-white;
}
</style>
