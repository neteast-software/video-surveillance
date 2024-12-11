<template>
	<div class="dataframe">
		<header class="flex-y-center justify-between mb-4 lt-laptop-(mb-2)">
			<h1>{{ listTitle }}</h1>
			<!-- <div class="i-icons:filter w-6 h-6 cursor-pointer"></div> -->
		</header>
		<div class="flex gap-3">
			<div
				class="bg-#F5F9FF rounded-1 text-greyText py-1.5 px-5 flex-center cursor-pointer transition leading-4"
				:class="{
					'bg-primary text-white': device.id === curdeviceType,
				}"
				@click="curdeviceType = device.id"
				v-for="device in deviceType"
			>
				{{ device.name }}
			</div>
		</div>
		<LineChart :source="source" class="h-55"></LineChart>
		<div class="w-full h-1px bg-greyLine my-4"></div>
		<div>
			<header class="flex-y-center justify-between font-600">
				<NDatePicker
					type="month"
					v-model:value="timestamp"
					format="yyyy年MM月"
					style="width: 140px"
				>
				</NDatePicker>
				<span
					class="cursor-pointer text-primary"
					:class="{ 'text-primary/20': clickDate === todayDate }"
					@click="backToday = true"
					>今日</span
				>
			</header>
			<Calendar
				:back-today="backToday"
				@back-today="backToday = $event"
				v-model:timestamp="timestamp"
				:events="events"
			></Calendar>
		</div>
		<div class="relative flex-h-rest overflow-hidden">
			<Transition appear name="slideBottom" v-if="alarmList.length > 0">
				<div
					class="flex-col gap-2.5 h-full mt-2 overflow-auto transition"
				>
					<div
						class="w-full rounded-1 py-3.5 px-3 lt-laptop-(py-3 px-2)"
						:class="
							eventType.find((item) => list.category === item.id)
								?.color || ''
						"
						v-for="list in alarmList"
					>
						<div class="flex-center gap-2">
							<img v-if="list.img" src="" alt="" />
							<img
								v-else
								src="@/assets/imgs/text/build.png"
								class="w-20 h-16 lt-laptop-(w-18 h-14) rounded-1"
								alt=""
							/>
							<div class="flex-w-rest overflow-hidden">
								<div
									class="text-4 lt-laptop-(text-3.5) flex-y-center gap-1"
								>
									<div class="flex-(y-center w-rest) gap-1">
										<div
											class="i-palette:alerts w-4 h-4"
											:class="`i-palette:${
												eventType.find(
													(item) =>
														list.category ===
														item.id
												)?.value || ''
											}`"
										></div>
										<div class="truncate flex-w-rest">
											{{ list.title }}
										</div>
									</div>
									<span class="text-(3 greyText)">{{
										list.happenTime
											.split(" ")[1]
											.slice(0, 5)
									}}</span>
								</div>
								<div
									class="list-desc text-greyText lt-laptop-(text-3)"
								>
									{{ list.content }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
			<listEmpty v-else class="!mt-0 z-0"></listEmpty>
		</div>
	</div>
</template>

<script setup lang="ts">
import LineChart from "@/components/chart/LineChart.vue";
import Calendar from "@/components/CalendarMonth.vue";
import listEmpty from "@/components/other/listEmpty.vue";
import { computed, onMounted, ref, watch } from "vue";
import { NDatePicker } from "naive-ui";
import { deviceType } from "@/utils/other/data";
import {
	getHistoryEvent,
	getHasAlarmByDate,
	getAlarmList,
} from "@/utils/network/api/statusMonitor";
import type { AlarmList } from "@/utils/network/types/statusMonitor";
import { createLineChart } from "@/utils/other/create";

import { format } from "date-fns";
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/utils/other/calendar";

const todayDate = format(new Date(), "yyyy-MM-dd"); // 当前日期
const timestamp = ref(new Date().getTime()); // 当前时间戳
const clickDate = computed(() =>
	format(new Date(timestamp.value), "yyyy-MM-dd")
);
const backToday = ref(false);
const curdeviceType = ref("0");

const listTitle = ref("历史事件列表");
const source = ref<(number | string)[][]>([]);
const alarmList = ref<AlarmList[]>([]);
async function initsource() {
	const { data } = await getHistoryEvent(curdeviceType.value, 1);
	listTitle.value = data?.dataBody.title;
	const dataList = data?.dataBody.dataList || [];
	const xAxis = data?.dataBody.abscissa || [];
	const xAxisDays = xAxis.map((date) => date.split("-")[2]);
	const items = dataList.map((item) =>
		Array.isArray(item.value)
			? [item.name, ...item.value]
			: [item.name, item.value]
	);
	source.value = [["日期", ...xAxisDays], ...items];
	if (!xAxis.length) {
		const names = dataList.map((item) => item.name);
		const values = dataList.map((item) => item.value);
		source.value = [
			["日期", ...names],
			["数量", ...(values as number[])],
		];
	}
	source.value = createLineChart(data.dataBody);
}
watch(() => curdeviceType.value, initsource);

const params = computed(() => {
	const startDay = format(
		getFirstDayOfMonth(new Date(timestamp.value)),
		"yyyy-MM-dd"
	);
	const endDay = format(
		getLastDayOfMonth(new Date(timestamp.value)),
		"yyyy-MM-dd"
	);
	console.log(startDay, endDay);
	return { startDay, endDay };
});
const events = ref();
async function initCalendar() {
	const { data } = await getHasAlarmByDate(
		params.value.startDay,
		params.value.endDay
	);
	events.value = data;
}
watch(
	() => [params.value.startDay, params.value.endDay],
	(newValues, oldValues) => {
		if (!oldValues) return initCalendar();
		if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
			initCalendar();
		}
	}
);

async function initList() {
	const { data } = await getAlarmList({ happenTime: clickDate.value });
	alarmList.value = data;
}
watch(() => timestamp.value, initList);
function initData() {
	initsource();
	initCalendar();
	initList();
}
onMounted(initData);

const eventType = [
	{ id: 1, name: "离线", value: "noequip", color: "bg-#F5F9FF" },
	// { id: 2, name: "设备", value: "" },
	// { id: 3, name: "非设备", value: "" },
];
</script>

<style scoped>
.list-name {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; /* 单行文本 */
}
:deep(.n-input .n-input__border, .n-input .n-input__state-border),
:deep(.n-input .n-input__state-border) {
	display: none;
}
:deep(.n-input .n-input__input-el) {
	font-size: 16px;
}
</style>
