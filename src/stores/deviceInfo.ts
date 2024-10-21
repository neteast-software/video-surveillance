import { time } from "console";
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
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 1,
      status: 1,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.60175, 25.75811],
      image: "/img/online-monitor.svg",
    },
    {
      id: 2,
      name: "设备地点名称",
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 1,
      status: 2,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.59718, 25.74615],
      image: "/img/offline-monitor.svg",
    },
    {
      id: 3,
      name: "设备地点名称",
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 1,
      status: 3,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.58967, 25.71834],
      image: "/img/abnormal-monitor.svg",
    },
    {
      id: 4,
      name: "设备地点名称",
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 0,
      status: 0,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.59825, 25.75018],
      image: "/img/key-projects.svg",
    },
    {
      id: 5,
      name: "设备地点名称",
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 2,
      status: 1,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.58518, 25.70896],
      image: "/img/online-helmet.svg",
    },
    {
      id: 6,
      name: "设备地点名称",
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 2,
      status: 3,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.59846, 25.79142],
      image: "/img/abnormal-helmet.svg",
    },
    {
      id: 7,
      name: "设备地点名称",
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 2,
      status: 2,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.60283, 25.77433],
      image: "/img/offline-helmet.svg",
    },
    {
      id: 8,
      name: "设备地点名称",
      project: "EPC-1北头岭隧道",
      address: "福州市鼓楼区鼓东街道道山西路中段96号",
      number: "001",
      time: "2021-07-01",
      type: 0,
      status: 0,
      onlineTime: 12,
      resolution: "1920*1080",
      coding: "H.264",
      position: [119.59251, 25.7262],
      image: "/img/key-projects.svg",
    },
    {
      id: 9,
      name: "项目部",
      position: [119.59135, 25.73374],
      image: "/img/project-dep.svg",
      type: 0,
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
