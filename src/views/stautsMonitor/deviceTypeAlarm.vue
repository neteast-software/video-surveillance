<template>
  <div class="dataframe relative">
    <div class="text-4 font-600">{{ title }}</div>
    <PieChart
      class="w-full"
      :source="source"
      subTitle="总数"
      :title="pieTitle"
    ></PieChart>
  </div>
</template>

<script setup lang="ts">
import PieChart from "@/components/chart/PieChart.vue";
import { getAlarmCount } from "@/utils/network/api/statusMonitor";
import type { PieSource } from "@/components/chart/PieChart.vue";
import { computed, onMounted, ref } from "vue";
const title = ref("设备类型告警数量");
const source = ref<PieSource>([]);
async function initData() {
  const { data } = await getAlarmCount();
  const dataBody = data.dataBody;
  title.value = dataBody.title;
  source.value = dataBody.dataList || [];
}
onMounted(initData);

const pieTitle = computed(() => {
  const isSmallScreen = window.innerHeight < 1000;
  console.log(source.value, window.innerHeight);
  return {
    show: true,
    text: source.value.reduce((acc, cur) => acc + cur.value, 0),
    subtext: "总数",
    left: isSmallScreen ? "48%" : "49%",
    top: isSmallScreen ? "36%" : "40%",
    textAlign: "center",
    itemGap: 5,
    textStyle: {
      fontSize: 30,
      color: "#3563EF",
      fontWeight: "bold",
    },
    subtextStyle: {
      fontSize: 14,
    },
  };
});
</script>

<style scoped></style>
