<template>
	<section
		class="py-6 overflow-hidden h-full shadow-common flex flex-col max-w-430px"
	>
		<header class="flex justify-between items-center px-5 lt-laptop-(px-3)">
			<div class="w-full relative">
				<div
					class="h-6.5 w-13 flex-center rounded-1 absolute right-1.5 top-1/2 -translate-y-1/2 z-10 bg-primary text-(white 3.5) cursor-pointer"
					@click="searchKeyword = keyword"
				>
					搜索
				</div>
				<NInput
					style="width: 100%; background: transparent"
					placeholder="请输入关键字"
					v-model:value="keyword"
				>
					<template #prefix>
						<div class="i-icons:search w-5 h-5"></div>
					</template>
				</NInput>
			</div>
		</header>
		<header
			class="flex justify-between items-center px-5 gap-x-6 lt-laptop-(gap-x-2 px-3)"
		>
			<NSelect
				style="width: 128px; background: transparent"
				:value="status || undefined"
				:options="statusOptions"
				placeholder="设备状态"
				@update:value="status = $event"
				clearable
			></NSelect>
			<!-- <NSelect
        style="width: 128px; background: transparent"
        :value="filter || undefined"
        :options="options"
        placeholder="设备nvr"
        @update:value="filter = $event"
        clearable
      ></NSelect> -->
			<NPopover
				trigger="click"
				placement="bottom"
				:show-arrow="false"
				v-model:show="popoverVisible"
			>
				<template #trigger>
					<div
						class="border-(1 solid greyLine) w-32 h-full rounded-1 text-#C2C2C2 flex-y-center justify-between px-2 cursor-pointer hover-border-primary truncate"
						:class="{
							'text-basic': filter !== '',
						}"
					>
						<!-- :class="{ 'text-basic': filter === 0 || filter }" -->
						{{
							options.find((option) => option.value === filter)
								? options.find(
										(option) => option.value === filter
								  )?.label
								: "设备nvr"
						}}
						<div class="i-icons:arrow w-4 h-4 rotate-180"></div>
					</div>
				</template>
				<div class="py-3 w-360px max-h-300px flex-col">
					<span class="text-(lightGrey 3)"> 选择设备NVR </span>
					<div
						class="grid grid-cols-2 gap-2 mt-3 overflow-auto flex-h-rest"
					>
						<div
							class="border-(1 solid greyLine) rounded-2 h-9 px-4 flex-y-center truncate"
							v-for="option in options"
							@click="
								(filter = option.value || 0),
									(popoverVisible = false)
							"
							:class="{ popActive: filter === option.value }"
						>
							{{ option.label }}
						</div>
					</div>
				</div>
			</NPopover>
			<NSelect
				style="width: 128px; background: transparent"
				v-model:value="labels"
				:options="labelOptions"
				max-tag-count="responsive"
				placeholder="设备标签"
				clearable
			></NSelect>
		</header>
		<section class="h-0 flex-1">
			<NScrollbar>
				<main class="flex-col gap-3 px-5 lt-laptop-(px-3)">
					<div
						v-for="nvr in filteredDeviceList"
						:key="nvr.id"
						class="border-(2 solid greyLine) rounded-1 py-4 px-3"
					>
						<h2
							class="m-0 mb-4 flex-between text-4 lt-laptop-(text-3.5)"
						>
							{{ nvr.name }}({{ nvr.channels?.length }})
							<div class="flex gap-4">
								<div class="flex-center gap-1 text-#4DC591">
									<div
										class="w-2.5 h-2.5 rounded-full bg-#4DC591"
									></div>
									{{
										nvr.channels?.filter((ch) => ch.online)
											.length || 0
									}}
								</div>
								<div class="flex-center gap-1 text-#707996">
									<div
										class="w-2.5 h-2.5 rounded-full bg-#707996"
									></div>
									{{
										nvr.channels?.filter((ch) => !ch.online)
											.length || 0
									}}
								</div>
								<!-- <div class="flex-center gap-1 text-#EA6733">
                  <div class="w-2.5 h-2.5 rounded-full bg-#EA6733"></div>
                  10
                </div> -->
							</div>
						</h2>
						<section
							class="flex flex-wrap gap-5 justify-between lt-laptop-(gap-4 mx-0)"
						>
							<template v-for="ch in nvr.channels" :key="ch.id">
								<MonitorCard
									:nvr-name="nvr.name"
									:monitor="ch"
									:imgAddr="ch.imgAddr"
									@click="onPickMonitor(nvr.id, nvr.name, ch)"
									:class="
										selectMonitorCard === ch.id
											? 'border-(3 solid #4DC591) '
											: ''
									"
								></MonitorCard>
							</template>
						</section>
					</div>
				</main>
			</NScrollbar>
		</section>
	</section>
</template>

<script setup lang="ts">
import {
	NScrollbar,
	SelectOption,
	NInput,
	NButton,
	NPopover,
	SelectRenderLabel,
	NRadioGroup,
	NRadio,
	NSpace,
	NSelect,
} from "naive-ui";
import MonitorCard from "./MonitorCard.vue";

import { computed, h, onMounted, ref, watch } from "vue";
// import {
//   getDevicesList,
//   NVRItem,
//   ChannelItem,
// } from "@/utils/network/api/security";
import { getDevicesList } from "@/utils/network/api/monitor";
import type { NVRItem, ChannelItem } from "@/utils/network/types/monitor";
import { useEventBus } from "@vueuse/core";
import { pickMonitorKey } from "./helper";
import { MonitorItem } from "@/utils/network/types/security";
import { v4 as uuidv4 } from "uuid";
import { de } from "date-fns/locale";
enum MonitorStatus {
	ALL = "all",
	ONLINE = "online",
	OFFLINE = "offline",
}
interface Props {
	regionId: number;
	activeMonitor: number;
	deviceId: number;
}
const props = withDefaults(defineProps<Props>(), {});
defineEmits<{
	select: [indexCode: string];
}>();
const monitorBus = useEventBus(pickMonitorKey);
const popoverVisible = ref(false);
const selectMonitorCard = ref(0);

function onPickMonitor(nvrId: number, nvrName: string, ch: ChannelItem) {
	console.log("onPickMonitor---");
	if (!ch.online) return;
	monitorBus.emit({
		key: uuidv4(),
		nvrId,
		nvrName,
		channelId: ch.id,
		channelName: ch.channelName,
		online: ch.online,
		channelNum: Number(ch.channelNum),
	});
	selectMonitorCard.value = ch.id;
}
watch(
	() => props.activeMonitor,
	(val) => {
		selectMonitorCard.value = val;
	}
);

const options = ref<SelectOption[]>([]);
const labelOptions = ref<SelectOption[]>([]);
const filter = ref<number | string>("");
const searchKeyword = ref<string>("");
const keyword = ref<string>("");

const status = ref<number | string>("");
const statusOptions = ref<SelectOption[]>([
	{ label: "在线", value: MonitorStatus.ONLINE },
	{ label: "离线", value: MonitorStatus.OFFLINE },
]);
const labels = ref<string[]>([]);
const deviceList = ref<NVRItem[]>([]);

const filteredDeviceList = computed(() => {
	const f = filter.value;
	const tmp = deviceList.value.filter((nvr) => !f || nvr.id === f);

	const selectStatus = status.value;
	const selectLabels = labels.value;
	// if (keyword.value) {
	return tmp
		.map((nvr) => {
			return {
				...nvr,
				channels: nvr.channels?.filter((ch) => {
					return (
						(selectStatus
							? selectStatus === MonitorStatus.ONLINE
								? ch.online
								: !ch.online
							: true) &&
						(selectLabels.length
							? haveCommonLabel(selectLabels, ch.labels || [])
							: true) &&
						ch.channelName.includes(searchKeyword.value)
					);
				}),
			};
		})
		.filter((nvr) => nvr.channels?.length);
	// }
	// return tmp;
});

async function initMonitorList() {
	const { data } = await getDevicesList();
	deviceList.value = data;

	const limit = 4;
	let len = 0;
	const cache: MonitorItem[] = [];
	const labelSet = new Set<string>();
	deviceList.value.forEach((nvr) => {
		// if (len >= limit) return;
		nvr.channels?.forEach((ch) => {
			if (ch.labels) {
				ch.labels.forEach((label) => {
					labelSet.add(label);
				});
			}
			if (len >= limit) return;
			if (!ch.online) return;
			if (!ch.online) return;
			cache.push({
				key: uuidv4(),
				nvrId: nvr.id,
				nvrName: nvr.name,
				channelId: ch.id,
				channelName: ch.channelName,
				online: ch.online,
				channelNum: Number(ch.channelNum),
			});
			len++;
		});
	});
	if (props.deviceId) {
		// onPickMonitor
		console.log(555555);
		console.log(deviceList.value);
		const nvr = deviceList.value.find((nvr) =>
			nvr.channels?.some((ch) => ch.id == props.deviceId)
		);
		console.log(nvr);
		if (nvr) {
			const ch = nvr.channels?.find((ch) => ch.id == props.deviceId);
			if (ch) {
				setTimeout(() => {
					onPickMonitor(nvr.id, nvr.name, ch);
				});
			}
		}
	}
	options.value = [
		{ label: "全部", value: 0 },
		...deviceList.value.map((nvr) => ({ label: nvr.name, value: nvr.id })),
	];
	labelOptions.value = [...labelSet].map((label) => ({
		label,
		value: label,
	}));
	monitorBus.emit(cache);
}
async function initData() {
	initMonitorList();
}
onMounted(initData);

function calcOnlineCounts(chs?: ChannelItem[] | null) {
	if (!chs) return 0;
	return chs.filter((ch) => ch.online).length;
}

function haveCommonLabel(arr1: string[], arr2: string[]) {
	return arr1.some((item) => arr2.includes(item));
}
</script>

<style scoped>
.online {
	@apply !bg-#4DC591;
}
.offline {
	@apply bg-#707996;
}
:deep(.n-base-selection .n-base-selection-label) {
	background-color: transparent;
}
:deep(.n-base-selection .n-base-selection-tags) {
	background-color: transparent;
}
.popActive {
	@apply bg-primaryLightBg text-primary;
}
</style>
