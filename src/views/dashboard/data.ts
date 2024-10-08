import totelIcon from "@/assets/svgs/total.svg";
import onlineIcon from "@/assets/svgs/online.svg";
import abnormalIcon from "@/assets/svgs/abnormal.svg";
import OfflineIcon from "@/assets/svgs/Offline.svg";
import { ref } from "vue";
export const selectDatas = ref([
  {
    label: "设备事件",
    value: "设备事件",
  },
  {
    label: "告警事件",
    value: "告警事件",
  },
  {
    label: "工单事件",
    value: "工单事件",
  },
  {
    label: "巡检事件",
    value: "巡检事件",
  },
]);
export const options = ref([
  {
    label: "总数",
    value: 56,
    icon: totelIcon,
  },
  {
    label: "在线",
    value: 36,
    icon: onlineIcon,
  },
  {
    label: "异常",
    value: 5,
    icon: abnormalIcon,
  },
  {
    label: "离线",
    value: 20,
    icon: OfflineIcon,
  },
]);
export const menuOptions = ref([
  {
    label: "全部",
    key: 1,
  },
  {
    label: "在线",
    key: 2,
  },
  {
    label: "离线",
    key: 3,
  },
  {
    label: "异常",
    key: 4,
  },
]);
export const dataList = ref([
  {
    name: "设备地点名称",
    type: "H264",
    status: "故障",
    onlineTime: 12,
    resolution: "1920*1080",
  },
  {
    name: "设备地点名称",
    type: "H264",
    status: "故障",
    onlineTime: 12,
    resolution: "1920*1080",
  },
  {
    name: "设备地点名称",
    type: "H264",
    status: "故障",
    onlineTime: 12,
    resolution: "1920*1080",
  },
  {
    name: "设备地点名称",
    type: "H264",
    status: "故障",
    onlineTime: 12,
    resolution: "1920*1080",
  },
  {
    name: "设备地点名称",
    type: "H264",
    status: "故障",
    onlineTime: 12,
    resolution: "1920*1080",
  },
]);
