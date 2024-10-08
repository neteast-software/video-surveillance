<template>
  <div class="relative">
    <Icon
      :icon="roundedDiamond"
      :width="100"
      color="rgba(255,255,255,0.2)"
    ></Icon>
    <NButton
      quaternary
      circle
      class="!absolute left-1/2 -translate-x-1/2 top-[2%]"
      @mousedown="$emit('command', 'TILT_UP', 0)"
      @mouseup="$emit('command', 'TILT_UP', 1)"
    >
      <Icon :icon="chevron" :width="20" color="#ffffff" :v-flip="true"></Icon>
    </NButton>
    <NButton
      quaternary
      circle
      class="!absolute left-[2%] top-1/2 -translate-y-1/2"
      @mousedown="$emit('command', 'PAN_LEFT', 0)"
      @mouseup="$emit('command', 'PAN_LEFT', 1)"
    >
      <Icon :icon="chevron" :width="20" color="#ffffff" :rotate="45"></Icon>
    </NButton>
    <NButton
      quaternary
      circle
      class="!absolute left-1/2 -translate-x-1/2 bottom-[2%]"
      @mousedown="$emit('command', 'TILT_DOWN', 0)"
      @mouseup="$emit('command', 'TILT_DOWN', 1)"
    >
      <Icon :icon="chevron" :width="20" color="#ffffff"></Icon>
    </NButton>
    <NButton
      quaternary
      circle
      class="!absolute right-[2%] top-1/2 -translate-y-1/2"
      @mousedown="$emit('command', 'PAN_RIGHT', 0)"
      @mouseup="$emit('command', 'PAN_RIGHT', 1)"
    >
      <Icon :icon="chevron" :width="20" color="#ffffff" :rotate="-45"></Icon>
    </NButton>
    <NButton
      quaternary
      circle
      class="!absolute left-[3%] top-[3%]"
      @mousedown="$emit('command', 'UP_LEFT', 0)"
      @mouseup="$emit('command', 'UP_LEFT', 1)"
    >
      <Icon :icon="corner" :width="20" color="#ffffff"></Icon>
    </NButton>
    <NButton
      quaternary
      circle
      class="!absolute right-[3%] top-[3%]"
      @mousedown="$emit('command', 'UP_RIGHT', 0)"
      @mouseup="$emit('command', 'UP_RIGHT', 1)"
    >
      <Icon :icon="corner" :width="20" color="#ffffff" :h-flip="true"></Icon>
    </NButton>
    <NButton
      quaternary
      circle
      class="!absolute right-[3%] bottom-[3%]"
      @mousedown="$emit('command', 'DOWN_RIGHT', 0)"
      @mouseup="$emit('command', 'DOWN_RIGHT', 1)"
    >
      <Icon
        :icon="corner"
        :width="20"
        color="#ffffff"
        :h-flip="true"
        :v-flip="true"
      ></Icon>
    </NButton>
    <NButton
      quaternary
      circle
      class="!absolute left-[3%] bottom-[3%]"
      @mousedown="$emit('command', 'DOWN_LEFT', 0)"
      @mouseup="$emit('command', 'DOWN_LEFT', 1)"
    >
      <Icon :icon="corner" :width="20" color="#ffffff" :v-flip="true"></Icon>
    </NButton>
    <NButton
      style="font-size: 12px; width: 30px; height: 30px"
      class="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      color="#4476e3"
      circle
      @click="$emit('toPreset')"
      >{{ havePreset ? "复位" : "" }}</NButton
    >
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NButton } from "naive-ui";
import { chevron, roundedDiamond, corner } from "@/playericons";
import { inject, ref } from "vue";
defineEmits<{
  command: [value: string, flag: number];
  toPreset: [];
}>();
const havePreset = inject("havePreset", ref(false));
</script>

<style scoped></style>
