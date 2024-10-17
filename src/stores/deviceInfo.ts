import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useDeviceInfoStore = defineStore("deviceInfo", () => {
  const curDeviceStatus = ref<number>(); // 设备状态
  const curdeviceType = ref(0); // 设备类型
  const curdeviceListId = ref(0); // 设备列表
  const DeviceStatus = ref([
    { label: "全部", value: 0, color: "#232D42" },
    { label: "在线", value: 1, color: "#4DC591" },
    { label: "离线", value: 2, color: "#8A92A6" },
    { label: "异常", value: 3, color: "#FF7648" },
  ]);
  const deviceType = ref([
    {
      id: 0,
      label: "全部",
    },
    {
      id: 1,
      label: "监控",
    },
    {
      id: 2,
      label: "安全帽",
    },
  ]);
  const dataList = ref([
    {
      id: 1,
      name: "设备地点名称",
      type: 1,
      status: 1,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.3, 26.078],
      image: "/img/online-monitor.svg",
    },
    {
      id: 2,
      name: "设备地点名称",
      type: 1,
      status: 2,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.3001, 26.076],
      image: "/img/offline-monitor.svg",
    },
    {
      id: 3,
      name: "设备地点名称",
      type: 1,
      status: 3,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.2938, 26.078],
      image: "/img/abnormal-monitor.svg",
    },
    {
      id: 4,
      name: "设备地点名称",
      type: 0,
      status: 0,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.2936, 26.08],
      image: "/img/key-projects.svg",
    },
    {
      id: 5,
      name: "设备地点名称",
      type: 2,
      status: 1,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.29503, 26.08031],
      image: "/img/online-helmet.svg",
    },
    {
      id: 6,
      name: "设备地点名称",
      type: 2,
      status: 3,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.29722, 26.07691],
      image: "/img/abnormal-helmet.svg",
    },
    {
      id: 7,
      name: "设备地点名称",
      type: 2,
      status: 2,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.29563, 26.0765],
      image: "/img/offline-helmet.svg",
    },
    {
      id: 8,
      name: "设备地点名称",
      type: 0,
      status: 0,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.29672, 26.07579],
      image: "/img/key-projects.svg",
    },
  ]);

  // 通过设备类型和状态对设备列表进行筛选
  const filteredDataList = computed(() => {
    return dataList.value.filter((device) => {
      const matchType =
        curdeviceType.value === 0 || device.type === curdeviceType.value;
      const matchStatus =
        curDeviceStatus.value === 0 ||
        curDeviceStatus.value === undefined ||
        device.status === curDeviceStatus.value;
      return matchType && matchStatus;
    });
  });

  return {
    curDeviceStatus,
    curdeviceType,
    curdeviceListId,
    DeviceStatus,
    deviceType,
    dataList,
    filteredDataList,
  };
});
