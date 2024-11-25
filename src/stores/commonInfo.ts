import { defineStore } from "pinia";
import storage from "@/utils/other/storage";
import { ref } from "vue";

export const useCommonInfoStore = defineStore("commonInfo", () => {
  const nickName = ref(storage.get("nickName") || "--");
  function setNickName(newNickName: string) {
    nickName.value = newNickName;
    storage.set("nickName", newNickName);
  }
  return { nickName, setNickName };
});
