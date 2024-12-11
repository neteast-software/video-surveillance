<template>
	<div class="dataframe">
		<h1>智慧安全帽状态</h1>
		<div class="flex gap-6 lt-laptop-(gap-3) mt-3">
			<div
				class="blue-gradient flex flex-y-center gap-9 items-between justify-between px-7 py-5 w-full rounded-2 lt-laptop-(gap-4 px-3 py-2)"
			>
				<div
					class="i-palette:probe w-11 h-12 lt-laptop-(w-9 h-9)"
				></div>
				<div class="text-7.5 lt-laptop-(text-6) font-700">
					{{ monitorStatus?.onlineCount || 0 }}
					<div
						class="text-(greyText 3) text-4 font-400 flex-center gap-2 whitespace-nowrap"
					>
						在线数
					</div>
				</div>
				<div class="text-7.5 lt-laptop-(text-6) font-700">
					{{ monitorStatus?.offlineCount || 0 }}
					<div
						class="text-(greyText 3) text-4 font-400 flex-center gap-2 whitespace-nowrap"
					>
						离线数
					</div>
				</div>
			</div>
			<div
				class="blue-gradient flex flex-y-center gap-9 px-7 py-3 w-full rounded-2 lt-laptop-(gap-4 px-3 py-2)"
			>
				<div
					class="i-palette:probe w-11 h-12 lt-laptop-(w-9 h-9)"
				></div>
				<div class="text-7.5 lt-laptop-(text-6) font-700">
					{{ monitorStatus?.alarmCount }}
					<div
						class="text-(greyText 3) text-4 font-400 flex-center gap-2 whitespace-nowrap"
					>
						告警数
						<div
							class="text-(#4DC591 3) flex-center"
							:class="
								monitorStatus?.alarmRate > 0
									? ''
									: 'text-#F94144'
							"
						>
							<div
								class="i-icons:caretdown w-4 h-4"
								:class="
									monitorStatus?.alarmRate > 0
										? 'rotate-180'
										: ''
								"
							></div>
							{{ monitorStatus?.alarmRate }}%
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getStatusTotal } from "@/utils/network/api/statusMonitor";
import type { StatusTotal } from "@/utils/network/types/statusMonitor";

const monitorStatus = ref<StatusTotal>({
	onlineCount: 0,
	alarmCount: 0,
	alarmRate: 0,
	offlineCount: 0,
});
async function initData() {
	const { data } = await getStatusTotal(3);
	monitorStatus.value = data;
}
onMounted(initData);
</script>

<style scoped></style>
