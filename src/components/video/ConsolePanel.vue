<template>
  <div class="flex px-6 py-5 gap-x-5">
    <DirectionPanel
      class="my-3"
      @command="(cmd, flag) => $emit('command', cmd, flag)"
      @to-preset="$emit('toPreset')"
    ></DirectionPanel>
    <Adjustor
      @increase-down="$emit('command', 'FOCUS_NEAR', 0)"
      @increase-up="$emit('command', 'FOCUS_NEAR', 1)"
      @decrease-down="$emit('command', 'FOCUS_FAR', 0)"
      @decrease-up="$emit('command', 'FOCUS_FAR', 1)"
      >焦点</Adjustor
    >
    <Adjustor
      @increase-down="$emit('command', 'ZOOM_IN', 0)"
      @increase-up="$emit('command', 'ZOOM_IN', 1)"
      @decrease-down="$emit('command', 'ZOOM_OUT', 0)"
      @decrease-up="$emit('command', 'ZOOM_OUT', 1)"
      >焦距</Adjustor
    >
    <Adjustor
      @increase-down="$emit('command', 'IRIS_OPEN', 0)"
      @increase-up="$emit('command', 'IRIS_OPEN', 1)"
      @decrease-down="$emit('command', 'IRIS_CLOSE', 0)"
      @decrease-up="$emit('command', 'IRIS_CLOSE', 1)"
      >光圈</Adjustor
    >
    <div class="flex flex-col justify-between">
      <ControlButton
        :button-size="36"
        :icon-size="20"
        label-class="text-[12px]"
        :icon="preset"
        @click="$emit('setPreset')"
        >设置预置点</ControlButton
      >
      <ControlButton
        :button-size="36"
        :icon-size="20"
        :icon="trash"
        label-class="text-[12px]"
        @click="$emit('clearPreset')"
        >清除预置点</ControlButton
      >
    </div>
    <!-- <div class="flex flex-col justify-between">
            <ControlButton
                class="text-sm"
                :icon="focus"
                icon-bg="rgba(255,255,255,0.2)"
                :label-style="{ lineHeight: '26px' }"
                >聚焦</ControlButton
            >
            <ControlButton
                class="text-sm"
                :icon="aperture"
                icon-bg="rgba(255,255,255,0.2)"
                :label-style="{ lineHeight: '26px' }"
                >光圈</ControlButton
            >
        </div> -->
  </div>
</template>

<script setup lang="ts">
import DirectionPanel from "./DirectionPanel.vue";
import Adjustor from "./Adjustor.vue";
import ControlButton from "../../components/video/ControlButton.vue";
import { preset } from "../../playericons";
import { electricity, trash } from "../../assets/icons";
defineEmits<{
  command: [value: string, flag: number];
  setPreset: [];
  toPreset: [];
  clearPreset: [];
}>();
</script>

<style scoped>
div {
  border-radius: 30%;
}
</style>
