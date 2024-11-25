import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getAlarmCategory } from "@/utils/network/api/index";
import { AlarmCategory } from "@/utils/network/types/index";

export const useCommonDataStore = defineStore("commonData", () => {
  const alarmCategory = ref<AlarmCategory[]>([]);
  async function getAlarmCategoryData(type?: string) {
    const { data } = await getAlarmCategory(type);
    alarmCategory.value = data;
  }

  return {
    alarmCategory,
    getAlarmCategoryData,
  };
});
