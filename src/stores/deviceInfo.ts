import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getAllDevices } from "@/utils/network/api/dashboard";
import { AllDevices } from "@/utils/network/types/dashboard";
import { deviceType } from "@/utils/other/data";

export const useDeviceInfoStore = defineStore("deviceInfo", () => {
	const curDeviceStatus = ref(); // 设备状态
	const curdeviceType = ref("0"); // 设备类型
	const curdeviceListId = ref(0); // 设备列表
	const dataList = ref<AllDevices[]>([]);
	const selectMonitorCard = ref(0);

	async function initAllDevices() {
		const { data } = await getAllDevices();
		if (!data) return;
		dataList.value = data;
	}

	const deviceStatus = ref([
		{ id: 0, label: "全部", value: "全部", name: "all", color: "#232D42" },
		{
			id: 1,
			label: "在线",
			value: "在线",
			name: "online",
			color: "#4DC591",
		},
		{
			id: 2,
			label: "离线",
			value: "离线",
			name: "offline",
			color: "#8A92A6",
		},
		{
			id: 3,
			label: "异常",
			value: "异常",
			name: "abnormal",
			color: "#FF7648",
		},
	]);
	function getIconByTypeAndStatus(type: string, status: string): string {
		// 获取设备类型的 value
		const typeValue = deviceType.find((item) => item.id === type)?.type;
		// 获取设备状态的 value
		const statusValue = deviceStatus.value.find(
			(item) => item.value === status
		)?.name;
		if (!typeValue || !statusValue) return "/img/key-projects.svg";
		return `img/${statusValue}-${typeValue}.svg`;
	}

	// 通过设备类型和状态对设备列表进行筛选
	const filteredDataList = computed(() => {
		return dataList.value.filter((device) => {
			const matchType =
				curdeviceType.value === "0" ||
				device.type === curdeviceType.value;
			const matchStatus =
				curDeviceStatus.value === "全部" ||
				curDeviceStatus.value === undefined ||
				device.status === curDeviceStatus.value;
			return matchType && matchStatus;
		});
	});

	return {
		curDeviceStatus,
		curdeviceType,
		curdeviceListId,
		deviceStatus,
		deviceType,
		dataList,
		filteredDataList,
		selectMonitorCard,
		initAllDevices,
		getIconByTypeAndStatus,
	};
});
