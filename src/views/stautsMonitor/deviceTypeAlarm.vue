<template>
  <div class="dataframe relative">
    <div class="text-4 font-600">{{ title }}</div>
    <PieChart class="w-full" :source="source"></PieChart>
  </div>
</template>

<script setup lang="ts">
import PieChart from "@/components/chart/PieChart.vue";
import { getAlarmCount } from "@/utils/network/api/statusMonitor";
import type { PieSource } from "@/components/chart/PieChart.vue";
import { onMounted, ref } from "vue";
const title = ref("设备类型告警数量");
const source = ref<PieSource>([]);
async function initData() {
  const { data } = await getAlarmCount();
  const dataBody = data.dataBody;
  title.value = dataBody.title;
  source.value = dataBody.dataList || [];
}
onMounted(initData);
</script>

<style scoped></style>
