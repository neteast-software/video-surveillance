<template>
  <div class="w-1/2 bg-#4880FF rounded-4">
    <img src="../../assets/imgs/notice/linebg.png" alt="" class="absolute" />
    <img
      src="../../assets/imgs/notice/imgbg.png"
      alt=""
      class="absolute right-16"
    />
    <header class="px-7.5 h-20 text-(white 6) flex-(between y-center)">
      <div class="flex-y-center gap-2">
        <div class="i-icons:notice w-6 h-6"></div>
        关于「体验版权益调整」的公告
      </div>
      <div
        class="i-icons:close w-6 h-6 cursor-pointer"
        @click="emit('update:showModal', false)"
      ></div>
    </header>
    <div class="bg-white py-6 rounded-b-4">
      <div
        class="inline-flex gap-2 bg-#F9F9F9 p-1 mx-7.5 rounded-2 border-(1px solid #f0f0f2) mb-5"
      >
        <div
          v-for="data in datas"
          :key="data.label"
          @click="active = data.label"
          :class="[
            'px-4 py-1 rounded-2 text-greyText cursor-pointer flex-center gap-1 transition',
            active === data.label ? 'bg-#3563ef text-white' : '',
          ]"
        >
          <div class="w-5 h-5" :class="`i-icons:${data.label}`"></div>
          {{ data.name }}({{ data.value }})
        </div>
      </div>
      <NScrollbar class="h-120 px-7.5">
        <div class="flex gap-5 mb-4" v-for="index in 8">
          <img
            src="../../assets/imgs/text/listImg.png"
            class="w-45 h-30"
            alt=""
          />
          <div class="flex-col justify-between py-1 w-full">
            <span class="text-4.5 font-600"
              >通知名称通知名称通知名称通知名称通知名称通知名称通知名称通知名称通知名称通知名称通知名称通知名称</span
            >
            <div class="flex-between text-greyText">
              <div class="flex-center gap-3">
                <div class="text-(primary 3) px-2 bg-#E1EAF6 rounded-2px">
                  类型名称
                </div>
                <span>来源：系统监测</span>
              </div>
              <span>2024-09-20 09：00</span>
            </div>
          </div>
        </div>
      </NScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NScrollbar } from "naive-ui";
interface Props {
  showModal: boolean;
}
const emit = defineEmits(["update:showModal"]);
withDefaults(defineProps<Props>(), {});
const active = ref("all");
const datas = ref([
  { name: "全部", value: "12", label: "all" },
  { name: "消息通知", value: "5", label: "mesnotice" },
  { name: "设备预警", value: "4", label: "quipwarn" },
  { name: "系统通知", value: "3", label: "sysnotice" },
]);
</script>

<style scoped></style>
