<template>
  <div class="h-16 bg-#4880FF flex-between py-3.5 px-6 text-white relative">
    <aside class="flex-center z-1">
      <div class="i-icons:logo w-6 h-6"></div>
      <span class="text-6 ml-1 mr-8">左海建投智慧工地系统</span>
      <span clas="text-4"
        >国道G228线长乐松下至福清元洪公路工程二、三期项目</span
      >
    </aside>
    <aside class="flex gap-10 z-1">
      <div
        class="flex-between bg-white/30 h-9 rounded-7.5 text-3"
        @click="emit('update:showModal', true)"
      >
        <div class="w-7.5 h-7.5 rounded-full flex-center bg-white ml-1 text-3">
          <!-- <NBadge
            :value="lastAlarm?.num"
            :max="99"
            :offset="[-2, 2]"
            color="#3563EF"
          >
          </NBadge> -->
          <div class="i-icons:message w-5.5 h-5.5 text-basic"></div>
        </div>
        <div class="mx-2 truncate max-w-60">
          {{ lastAlarm?.title }}
        </div>
        <span class="mr-4">{{ lastAlarm?.happenTime }}</span>
      </div>
      <div
        class="text-3.5 px-2 py-1.5 bg-white/30 rounded-1 flex-center gap-2 cursor-pointer"
        @click="toggle()"
        ref="fsWrapper"
        id="fullscreen"
      >
        <div
          class="w-5 h-5"
          :class="isFullscreen ? 'i-icons:quitscreen' : 'i-icons:fullscreen'"
        ></div>
        {{ isFullscreen ? "退出" : "全屏" }}
      </div>
    </aside>
    <div class="w-30 h-full bg-white/20 z-0 absolute left-8% -skew-x-20"></div>
    <img
      src="../assets/imgs/navbarBg.png"
      class="absolute right-0 top-0 h-full z-0"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { NBadge } from "naive-ui";
import { onMounted, ref } from "vue";
import { useFullscreen } from "@vueuse/core";
import { getLastAlarm } from "@/utils/network/api/index";
import { LastAlarm } from "@/utils/network/types";
const { isFullscreen, toggle } = useFullscreen();

interface Props {
  showModal: boolean;
}
const emit = defineEmits(["update:showModal"]);
withDefaults(defineProps<Props>(), {});
const BadgeValue = ref(11);

const lastAlarm = ref<LastAlarm>();
async function initData() {
  const { data } = await getLastAlarm();
  console.log(data);
  lastAlarm.value = data;
}
onMounted(initData);
</script>

<style scoped>
:deep(.n-badge .n-badge-sup) {
  font-size: 8px;
  padding: 3px;
  height: 14px;
}
</style>
