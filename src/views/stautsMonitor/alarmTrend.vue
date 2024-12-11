<template>
	<div class="dataframe">
		<header class="flex justify-between">
			<h1>告警事件趋势</h1>
			<div class="w-70 h-8 bg-#F5F9FF rounded-7.5 flex cursor-pointer">
				<div
					class="min-w-1/3 px-2 flex-center rounded-7.5 text-greyText transition"
					v-for="item in deviceType"
					:class="{ active: item.id === selectType }"
					@click="selectType = item.id"
				>
					{{ item.name }}
				</div>
			</div>
		</header>
		<div class="flex-col flex-h-rest mt-3 lt-laptop-(mt-1)">
			<ResponsiveTrendChart
				:selectType="selectType"
			></ResponsiveTrendChart>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { deviceType } from "@/utils/other/data";
import ResponsiveTrendChart from "./ResponsiveTrendChart.vue";

const selectType = ref("0");
</script>

<style scoped>
.active {
	@apply bg-primary text-white;
}
</style>
