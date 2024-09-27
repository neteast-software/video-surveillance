// 控制台 按钮
<template>
  <div class="flex flex-col items-center text-white gap-y-2.5">
    <NButton
      circle
      size="small"
      color="rgba(255,255,255,0.2)"
      @mousedown="$emit('increase-down')"
      @mouseup="$emit('increase-up')"
    >
      <Icon :icon="plus" :width="20"></Icon>
    </NButton>
    <div
      class="h-0 flex-1 w-10.5 rounded-full flex justify-center items-center bg-white/20"
    >
      <slot></slot>
    </div>
    <NButton
      circle
      size="small"
      color="rgba(255,255,255,0.2)"
      @mousedown="$emit('decrease-down')"
      @mouseup="$emit('decrease-up')"
    >
      <Icon :icon="minus" :width="20"></Icon>
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { plus, minus } from "../../playericons";
import { NButton } from "naive-ui";
defineEmits(["increase-down", "increase-up", "decrease-down", "decrease-up"]);
</script>

<style scoped>
div {
  font-size: 0.75rem;
}
</style>
