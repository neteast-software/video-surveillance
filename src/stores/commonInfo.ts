import { defineStore } from "pinia";
import storage from "@/utils/other/storage";
import { ref } from "vue";

export const useCommonInfoStore = defineStore("commonInfo", () => {
	const nickName = ref(storage.get("nickName") || "--");
	const userCode = ref(storage.get("userCode") || "");
	const allowModify = ref(false);
	function setNickName(newNickName: string) {
		nickName.value = newNickName;
		storage.set("nickName", newNickName);
	}
	function setUserCode(newUserCode: string) {
		userCode.value = newUserCode;
		storage.set("userCode", newUserCode);
	}
	return { nickName, allowModify, userCode, setNickName, setUserCode };
});
