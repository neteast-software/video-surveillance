<template>
  <div
    class="fill-parent bg-#94BFFF p-7.5 relative overflow-hidden flex justify-between"
  >
    <leftAaside class="z-1"></leftAaside>
    <NPopselect
      v-model:value="selectValue"
      :options="options"
      :render-label="renderLabel"
      trigger="hover"
      :show-checkmark="false"
      v-model:show="selectState"
    >
      <div
        class="flex-between bg-white py-2.5 px-4 h-12 rounded-2px gap-8 text-4 min-w-39 z-1"
      >
        {{ selectValue }}
        <div class="bg-#EAEFFD w-7 h-7 rounded-2px flex-center">
          <div
            class="i-icons:arrow w-5 h-5 text-primary transition"
            :class="{ 'rotate-180': selectState }"
          ></div>
        </div>
      </div>
    </NPopselect>
    <div class="absolute top-0 left-0 w-full h-full z-0">
      <CesiumTianditu></CesiumTianditu>
      <PointBubble></PointBubble>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftAaside from "@/views/dashboard/leftAside.vue";
import CesiumTianditu from "@/components/map/CesiumTianditu.vue";
import { NPopselect, SelectRenderLabel, NCheckbox } from "naive-ui";
import { h, ref } from "vue";
import PointBubble from "./pointBubble.vue";
import { bubblePosition, bubbleVisible } from "@/utils/map/mark";
const selectValue = ref("设备类型");
const selectState = ref(false);
const options = [
  { label: "全部", value: "全部", color: "#232D42" },
  { label: "在线设备", value: "在线设备", color: "#4DC591" },
  { label: "离线设备", value: "离线设备", color: "#8A92A6" },
  { label: "异常设备", value: "异常设备", color: "#FF7648" },
];
const renderLabel: SelectRenderLabel = (option) => {
  return h(
    "div",
    {
      class: "flex-between gap-2 w-36 px-2",
    },
    [
      h("div", { class: "flex-center gap-2" }, [
        h("div", {
          class: "w-2 h-2 bg-black rounded-full ",
          style: {
            backgroundColor: option.color,
          },
        }),
        h("div", {}, option.label as string),
      ]),
      h(NCheckbox, {
        class: "w-4 h-4 ",

        checked: option.value === selectValue.value, // 如果当前选项的值等于 selectValue，则选中
      }),
    ]
  );
};
</script>

<style scoped></style>
