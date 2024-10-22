import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getAllDevices } from "@/utils/network/api/dashboard";
import { AllDevices } from "@/utils/network/types/dashboard";

export const useDeviceInfoStore = defineStore("deviceInfo", () => {
  const curDeviceStatus = ref<number>(); // 设备状态
  const curdeviceType = ref(1); // 设备类型
  const curdeviceListId = ref(0); // 设备列表
  // const dataList = ref<AllDevices[]>([]);
  const dataList = ref<AllDevices[]>([
    // {
    //   id: 1,
    //   name: "设备地点名称",
    //   alarmInfo: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   serialNo: "001",
    //   type: 2,
    //   status: 1,
    //   durationOnline: 12,
    //   resolution: "1920*1080",
    //   compression: "H.264",
    //   lng: "119.60175",
    //   lat: "25.75811",
    //   manufacturer: "海康威视",
    //   responsible: "张三",
    //   // time: "2021-07-01",
    //   // position: [119.60175, 25.75811],
    //   // image: "/img/online-monitor.svg",
    // },
    // {
    //   id: 2,
    //   name: "设备地点名称",
    //   alarmInfo: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   serialNo: "001",
    //   type: 2,
    //   status: 3,
    //   durationOnline: 12,
    //   resolution: "1920*1080",
    //   compression: "H.264",
    //   lng: "119.59718",
    //   lat: "25.74615",
    //   manufacturer: "海康威视",
    //   responsible: "张三",
    // },
    // {
    //   id: 3,
    //   name: "设备地点名称",
    //   alarmInfo: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   number: "001",
    //   time: "2021-07-01",
    //   type: 1,
    //   status: 3,
    //   onlineTime: 12,
    //   resolution: "1920*1080",
    //   coding: "H.264",
    //   position: [119.58967, 25.71834],
    //   image: "/img/abnormal-monitor.svg",
    // },
    // {
    //   id: 4,
    //   name: "设备地点名称",
    //   project: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   number: "001",
    //   time: "2021-07-01",
    //   type: 0,
    //   status: 0,
    //   onlineTime: 12,
    //   resolution: "1920*1080",
    //   coding: "H.264",
    //   position: [119.59825, 25.75018],
    //   image: "/img/key-projects.svg",
    // },
    // {
    //   id: 5,
    //   name: "设备地点名称",
    //   project: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   number: "001",
    //   time: "2021-07-01",
    //   type: 2,
    //   status: 1,
    //   onlineTime: 12,
    //   resolution: "1920*1080",
    //   coding: "H.264",
    //   position: [119.58518, 25.70896],
    //   image: "/img/online-helmet.svg",
    // },
    // {
    //   id: 6,
    //   name: "设备地点名称",
    //   project: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   number: "001",
    //   time: "2021-07-01",
    //   type: 2,
    //   status: 3,
    //   onlineTime: 12,
    //   resolution: "1920*1080",
    //   coding: "H.264",
    //   position: [119.59846, 25.79142],
    //   image: "/img/abnormal-helmet.svg",
    // },
    // {
    //   id: 7,
    //   name: "设备地点名称",
    //   project: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   number: "001",
    //   time: "2021-07-01",
    //   type: 2,
    //   status: 2,
    //   onlineTime: 12,
    //   resolution: "1920*1080",
    //   coding: "H.264",
    //   position: [119.60283, 25.77433],
    //   image: "/img/offline-helmet.svg",
    // },
    // {
    //   id: 8,
    //   name: "设备地点名称",
    //   project: "EPC-1北头岭隧道",
    //   address: "福州市鼓楼区鼓东街道道山西路中段96号",
    //   number: "001",
    //   time: "2021-07-01",
    //   type: 0,
    //   status: 0,
    //   onlineTime: 12,
    //   resolution: "1920*1080",
    //   coding: "H.264",
    //   position: [119.59251, 25.7262],
    //   image: "/img/key-projects.svg",
    // },
    // {
    //   id: 9,
    //   name: "项目部",
    //   // position: [119.59135, 25.73374],
    //   position: [119.31, 26.01],
    //   image: "/img/project-dep.svg",
    //   type: 0,
    // },
  ]);
  async function initAllDevices() {
    const { data } = await getAllDevices();
    console.log("initAllDevices", data);
    if (!data) return;
    dataList.value = data;
  }

  const deviceStatus = ref([
    { value: 0, label: "全部", name: "all", color: "#232D42" },
    { value: 1, label: "在线", name: "online", color: "#4DC591" },
    { value: 2, label: "离线", name: "offline", color: "#8A92A6" },
    { value: 3, label: "异常", name: "abnormal", color: "#FF7648" },
  ]);
  const deviceType = ref([
    {
      id: 1,
      label: "全部",
      value: "all",
    },
    {
      id: 2,
      label: "监控",
      value: "monitor",
    },
    {
      id: 3,
      label: "安全帽",
      value: "helmet",
    },
  ]);
  function getIconByTypeAndStatus(type: number, status: number): string {
    // 获取设备类型的 value
    const typeValue = deviceType.value.find((item) => item.id === type)?.value;
    // 获取设备状态的 value
    const statusValue = deviceStatus.value.find(
      (item) => item.value === status
    )?.name;
    if (!typeValue || !statusValue) return "/img/key-projects.svg";
    return `/img/${statusValue}-${typeValue}.svg`;
  }

  // 通过设备类型和状态对设备列表进行筛选
  const filteredDataList = computed(() => {
    return dataList.value.filter((device) => {
      const matchType =
        curdeviceType.value === 1 || device.type === curdeviceType.value;
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
    deviceStatus,
    deviceType,
    dataList,
    filteredDataList,
    initAllDevices,
    getIconByTypeAndStatus,
  };
});
