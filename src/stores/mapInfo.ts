import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMapInfoStore = defineStore("mapInfo", () => {
  // const showDetails = ref(false); // 是否显示详情
  const zoomLevel = ref(25000); // 地图缩放等级
  const show3D = ref(false); // 是否显示3D
  const backOrigin = ref(false); // 是否返回原点
  const curDetailId = ref(0); // 当前详情id

  return {
    // showDetails,
    curDetailId,
    zoomLevel,
    show3D,
    backOrigin,
  };
});
