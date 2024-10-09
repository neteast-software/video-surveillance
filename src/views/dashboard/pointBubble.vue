<template>
  <div
    v-if="bubbleVisible"
    class="bg-white px-7.5 py-8 rounded-1 z-1 absolute text-4 transition"
    :style="{
      top: `${bubblePosition[1] - 400}px`,
      left: `${bubblePosition[0] - 300}px`,
    }"
  >
    <header class="flex-y-center gap-3 mb-5">
      <div class="text-4.5 font-600">设备故障</div>
      <div class="py-1.5 px-2.5 bg-#FFF0D4 rounded-2px text-#FF7648">
        等待30:05
      </div>
    </header>
    <section class="mb-10">
      <div class="flex gap-2.5">
        <div class="i-icons:position w-5 h-5 text-greyText mt-1"></div>
        <div>
          <div class="text-4.5">EPC-北头岭隧道</div>
          <span class="text-lightGrey"
            >福州市鼓楼区鼓东街道道山西路中段96号</span
          >
        </div>
      </div>
      <div class="my-5">设备编号:hauadbjvdx</div>
      <div>负责人员:张三三</div>
    </section>
    <footer class="flex items-center justify-around text-(4.5 primary)">
      <div class="flex-center gap-2">
        <div class="i-icons:event w-5 h-5"></div>
        设备事件
      </div>
      <div class="w-1px h-6 bg-greyLine"></div>
      <div class="flex-center gap-2">
        <div class="i-icons:trend w-5 h-5"></div>
        在线趋势
      </div>
    </footer>
    <div class="absolute -top-38 left-0 h-37 w-62 bg-white p-1 rounded-2">
      <img src="../../assets/imgs/text/text.png" class="fill-parent" alt="" />
      <div
        class="i-icons:fullscreen w-5 h-5 text-white absolute bottom-2 right-2"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { bubblePosition, bubbleVisible } from "@/utils/map/mark";
defineProps({
  visible: Boolean,
  position: {
    type: Array,
    default: () => [0, 0], // 弹窗的初始位置
  },
});
</script>

<style scoped></style>
