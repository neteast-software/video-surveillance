import totelIcon from "@/assets/svgs/total.svg";
import onlineIcon from "@/assets/svgs/online.svg";
import abnormalIcon from "@/assets/svgs/abnormal.svg";
import OfflineIcon from "@/assets/svgs/Offline.svg";
import { ref } from "vue";
export interface MapState {
  zoomLevel: number;
  show3D: boolean;
  backOrigin: boolean;
}

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
    id: 1,
    label: "总数",
    value: 56,
    icon: totelIcon,
  },
  {
    id: 2,
    label: "在线",
    value: 36,
    icon: onlineIcon,
  },
  {
    id: 3,
    label: "异常",
    value: 5,
    icon: abnormalIcon,
  },
  {
    id: 4,
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
    label: "异常",
    key: 3,
  },
  {
    label: "离线",
    key: 4,
  },
]);
