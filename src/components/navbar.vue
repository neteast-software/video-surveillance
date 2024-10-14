<template>
  <div class="h-16 bg-#4880FF flex-between py-3.5 px-6 text-white relative">
    <aside class="flex-center z-1">
      <div class="i-icons:logo w-6 h-6"></div>
      <span class="text-5 ml-1 mr-2">视频监控系统</span>
      <span clas="text-4">国道G228线二、三期项目</span>
    </aside>
    <aside class="flex gap-10 z-1">
      <div
        class="flex-between bg-white/30 h-9 rounded-7.5 text-3"
        @click="emit('update:showModal', true)"
      >
        <div class="w-7.5 h-7.5 rounded-full flex-center bg-white ml-1 text-3">
          <NBadge
            :value="BadgeValue"
            :max="20"
            :offset="[-2, 2]"
            color="#3563EF"
          >
            <div class="i-icons:message w-5.5 h-5.5 text-basic"></div>
          </NBadge>
        </div>
        <span class="mx-2">通知性文字通知性文字通知性文字</span>
        <span class="mr-4">一个小时前</span>
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
import { ref } from "vue";
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();

interface Props {
  showModal: boolean;
}
const emit = defineEmits(["update:showModal"]);
withDefaults(defineProps<Props>(), {});
const BadgeValue = ref(11);
</script>

<style scoped>
:deep(.n-badge .n-badge-sup) {
  font-size: 8px;
  padding: 3px;
  height: 14px;
}
</style>
