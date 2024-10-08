<template>
  <div class="bg-black/50 bar px-4 py-3">
    <section class="flex gap-x-18">
      <RecordButton
        :class="{ 'pointer-events-none': !isReady }"
        @record="$emit('record', $event)"
        @finish="$emit('stopRecord', $event)"
      ></RecordButton>
      <ControlButton
        :class="{ 'pointer-events-none': !isReady }"
        :icon="screenshot"
        @click="$emit('screenshot')"
        >截图</ControlButton
      >
    </section>
    <section class="flex items-center gap-x-18">
      <ControlButton
        :class="{ 'pointer-events-none': !isReady }"
        :active="!isRecord"
        icon="heroicons:rocket-launch"
        active-icon="heroicons:rocket-launch-solid"
        @click="isRecord = false"
        >实时视频</ControlButton
      >
      <ControlButton
        ref="historyBtn"
        :class="{ 'pointer-events-none': !isReady }"
        :active="isRecord"
        :icon="record"
        :active-icon="recordSolid"
        @click="
          isRecord = true;
          historySwitch ? hideHistory() : showHistory();
        "
      >
        视频历史
      </ControlButton>
      <ControlButton
        :active="!muted"
        :class="{ 'pointer-events-none': !isReady }"
        :icon="audioOff"
        :active-icon="audioSolid"
        @click="$emit('update:muted', !muted)"
      >
        声音
      </ControlButton>
      <NPopover
        placement="top"
        trigger="click"
        style="padding: 0; opacity: 0.8; border-radius: 10%"
        :content-style="{
          backgroundColor: 'rgba(25, 25, 25, 0.9)',
          borderRadius: '10%',
          padding: '-5px',
        }"
        :arrow-style="{ backgroundColor: 'rgba(25, 25, 25, 0.9)' }"
        @update:show="consoleSwitch = $event"
      >
        <template #trigger>
          <ControlButton
            :class="{ 'pointer-events-none': !isReady }"
            :active="consoleSwitch"
            :icon="consoleIcon"
            :active-icon="consoleSolid"
          >
            控制台
          </ControlButton>
        </template>
        <ConsolePanel
          @set-preset="$emit('setPreset')"
          @to-preset="$emit('toPreset')"
          @clear-preset="$emit('clearPreset')"
          @command="(cmd, flag) => $emit('command', cmd, flag)"
        ></ConsolePanel>
      </NPopover>
    </section>
    <section class="flex justify-end gap-x-18">
      <slot name="middle-right"></slot>
      <slot name="right"></slot>
      <!-- <ControlButton :icon="preset" @click="$emit('add-preset')"> 添加预置点 </ControlButton> -->
      <ControlButton
        :class="{ 'pointer-events-none': !isReady }"
        :icon="pictureInPicture"
        @click="$emit('pip')"
      >
        画中画
      </ControlButton>
    </section>
    <VideoHistory
      v-show="historySwitch"
      :show-record="isRecord"
      ref="videoRef"
      class="absolute bottom-22 left-0 w-full"
      @time-change="$emit('timeChange', $event)"
      @speed-change="$emit('speedChange', $event)"
    >
      <template #historyRight>
        <slot name="historyRight"></slot>
      </template>
    </VideoHistory>
  </div>
</template>

<script setup lang="ts">
import ControlButton from "./ControlButton.vue";
import RecordButton from "./RecordButton.vue";
import {
  record,
  recordSolid,
  audioOff,
  audioSolid,
  console as consoleIcon,
  consoleSolid,
  preset,
  fullscreen,
  screenshot,
  pictureInPicture,
} from "@/playericons";
import { NPopover } from "naive-ui";
import ConsolePanel from "./ConsolePanel.vue";
import VideoHistory from "./videoHistory.vue";
import { ref, inject, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { isReadyKey, isRecordKey } from "./helper";
interface Props {
  muted?: boolean;
}
withDefaults(defineProps<Props>(), {
  muted: true,
});
const emit = defineEmits<{
  audioChange: [flag: boolean];
  fullscreen: [];
  "add-preset": [];
  setPreset: [];
  toPreset: [];
  clearPreset: [];
  command: [value: string, flag: number];
  record: [];
  stopRecord: [];
  screenshot: [];
  pip: [];
  timeChange: [time: Date];
  speedChange: [speed: number];
  "update:isRecord": [flag: boolean];
  "update:muted": [flag: boolean];
}>();
const isReady = inject(isReadyKey, ref(false));
const isRecord = inject(isRecordKey, ref(false));
// watch(isRecord, (val) => {
//     historySwitch.value = val;
// });
const historyBtn = ref<HTMLElement>();
// const audioSwitch = ref(!props.muted);
const historySwitch = ref(false);
const consoleSwitch = ref(false);
const videoRef = ref(null);
onClickOutside(videoRef, hideHistory, { ignore: [historyBtn] });
function hideHistory() {
  // emit('update:isRecord', false);
  historySwitch.value = false;
}
function showHistory() {
  // emit('update:isRecord', true);
  historySwitch.value = true;
}
defineExpose({
  historySwitch,
  hideHistory,
  showHistory,
});
</script>
<style scoped>
.bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
}
</style>
