<template>
  <div class="bg-[#191919]/80 h-62 w-[1288px] py-8 px-7.5">
    <div class="shadow-outline">
      <div class="flex flex-col items-center w-full h-full">
        <header class="flex justify-between w-full px-8 mt-5 mb-4">
          <div
            v-for="(timeTag, idx) in timeTagList"
            :key="timeTag"
            class="bg-white h-2.5 w-px relative"
          >
            <div
              v-if="idx % 2 === 0"
              class="absolute -top-5 -translate-x-[50%] text-white text-sm whitespace-nowrap"
            >
              {{ timeTag }}
            </div>
          </div>
        </header>
        <main class="w-full h-16 bg-[#152937]/70 px-8 select-none">
          <div
            class="flex w-full h-full relative"
            ref="container"
            @click.self="
              left = $event.offsetX;
              emitTimeChange();
            "
          >
            <canvas
              ref="dateLine"
              class="pointer-events-none w-full h-full absolute py-2"
            ></canvas>
            <canvas
              ref="eventsLine"
              class="pointer-events-none w-full h-full absolute py-2"
            ></canvas>
            <div
              class="absolute w-6 h-[150%] top-1/2 -translate-y-1/2 cursor-pointer translate-x-[-50%]"
              ref="line"
              :style="{ left: `${left}px`, willChange: 'left' }"
              @mouseenter="showCurrentTime = true"
              @mouseleave="showCurrentTime = false"
            >
              <img
                src="../assets/videoLine.svg"
                alt=""
                class="absolute max-w-none left-1/2 top-1/2 -translate-x-[50%] -translate-y-1/2 pointer-events-none"
              />
              <div
                class="flex-center text-white h-8 w-20 rounded-md bg-[#4476e3] absolute left-6 -top-3 triangle"
                v-if="showCurrentTime"
              >
                {{ format(currentTime, "HH:mm:ss") }}
              </div>
            </div>
            <div
              class="absolute top-0 left-0 isGradient h-full pointer-events-none"
              :style="{ width: `${left}px`, willChange: 'width' }"
            ></div>
          </div>
        </main>
      </div>
    </div>
    <footer class="flex w-full relative">
      <div class="flex-center text-white mt-11 absolute">
        <Icon
          :icon="arrow"
          class="w-6 h-6 rotate-180 cursor-pointer"
          @click="lastDay"
        ></Icon>
        <NDatePicker
          style="width: 102px"
          type="date"
          :value="selectedDate.getTime()"
          :is-date-disabled="dateDisabled"
          :theme="datePickerDark"
          :to="false"
          @update:value="pickDay"
        >
        </NDatePicker>
        <div class="cursor-pointer" @click="nextDay">
          <Icon :icon="arrow" class="w-6 h-6"></Icon>
        </div>
      </div>
      <div class="flex-center gap-10 mt-7 w-full">
        <ControlButton
          :icon="rewindIcon"
          iconBg="rgba(255, 255, 255, 0.2)"
          :buttonSize="40"
          @click="Rewind"
        ></ControlButton>
        <ControlButton
          :icon="playIcon"
          :active-icon="pauseIcon"
          :active="isPlaying"
          iconBg="rgba(255, 255, 255, 0.2)"
          :buttonSize="52"
          @click="isPlaying = !isPlaying"
        ></ControlButton>
        <ControlButton
          :icon="fastForwardIcon"
          iconBg="rgba(255, 255, 255, 0.2)"
          :buttonSize="40"
          @click="FastForward"
        ></ControlButton>
        <NDropdown
          class="!text-white"
          key-field="value"
          placement="top"
          :options="
            speedOptions
              .map((item) => ({
                label: `${item.toFixed(1)}X`,
                value: item,
                props: { style: { color: '#fff' } },
              }))
              .reverse()
          "
          @select="activeSpeed = $event"
          :to="false"
          style="background-color: #191919"
        >
          <ControlButton
            class="relative"
            iconBg="rgba(255, 255, 255, 0.2)"
            :buttonSize="40"
          >
            <img
              class="absolute-center"
              style="
                width: 28px;
                height: 28px;
                line-height: 28px;
                margin-top: -4px;
              "
              src="./speed.svg"
            />
            <span
              class="absolute-center"
              style="font-size: 10px; margin-top: -2px"
              >{{ activeSpeed.toFixed(1) }}</span
            >
          </ControlButton>
        </NDropdown>
      </div>
      <div class="mt-11 relative">
        <slot name="historyRight"></slot>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  differenceInSeconds,
  format,
  add,
  startOfDay,
  addDays,
} from "date-fns";
import { computed, onMounted, ref, unref, inject, watch, nextTick } from "vue";
import { useDrag } from "@/utils/other/videoDrag";
import { Icon } from "@iconify/vue";
import arrow from "@/assets/icons/arrow";
import {
  rewind as rewindIcon,
  pause as pauseIcon,
  play as playIcon,
  fastForward as fastForwardIcon,
  speed,
  speed10,
  speed15,
} from "@/playericons";
import ControlButton from "./ControlButton.vue";
import { NDatePicker, NDropdown } from "naive-ui";
import { datePickerDark } from "naive-ui";
import { dateDisabled, drawDashed, drawEvents } from "./videoHistoryHelper";
import { useFps } from "@vueuse/core";
import {
  recordTimerKey,
  isPlayingKey,
  isRecordKey,
  playSpeedKey,
} from "./helper";
interface Props {
  showRecord?: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{
  timeChange: [time: Date];
  speedChange: [speed: number];
}>();
const recordTimer = inject(recordTimerKey, ref(0));
const isRecord = inject(isRecordKey, ref(false));
const FPS = useFps();
const container = ref<HTMLElement>();
const line = ref<HTMLElement>();
function onMove() {
  emit("timeChange", unref(currentTime));
}
const { left, width } = useDrag(line, container, { onMove });

const selectedDate = ref<Date>(new Date());
const startTime = computed(() => startOfDay(unref(selectedDate)));
const endTime = computed(() => startOfDay(addDays(unref(selectedDate), 1)));
const tickNumber = 25; //刻度数
const totalSeconds = computed(() =>
  differenceInSeconds(unref(endTime), unref(startTime))
); //总秒数
const step = computed(() => unref(totalSeconds) / (tickNumber - 1));
const timeTagList = computed(() =>
  new Array(tickNumber)
    .fill(unref(startTime))
    .map((startTime: Date, idx) =>
      format(add(startTime, { seconds: unref(step) * idx }), "HH:mm:ss")
    )
);

//当前时间
const currentTime = computed(() =>
  add(
    props.showRecord
      ? add(unref(startTime), { seconds: unref(recordTimer) })
      : unref(startTime),
    {
      seconds: unref(totalSeconds) * (unref(left) / unref(width)),
    }
  )
);
const showCurrentTime = ref(false);
function emitTimeChange(time?: Date) {
  recordTimer.value = 0;
  emit("timeChange", time || currentTime.value);
}
function lastDay() {
  selectedDate.value = addDays(unref(selectedDate), -1);
  left.value = 0;
  emitTimeChange();
}
function nextDay() {
  selectedDate.value = addDays(unref(selectedDate), 1);
  left.value = 0;
  emitTimeChange();
}
function pickDay(date: number) {
  selectedDate.value = new Date(date);
  left.value = 0;
  emitTimeChange();
}
let isFirst = true;
watch(isRecord, (val) => {
  console.log("isRecord改变", val);
  if (!val) {
    isFirst = true;
    // emitTimeChange();
  }
});
watch(
  () => props.showRecord,
  (showRecord) => {
    if (!showRecord) return;
    if (isFirst) {
      emitTimeChange();
      isFirst = false;
    }
    nextTick(() => {
      drawDashed(dateLine);
    });
  }
);
// onMounted(() => {
//     emit('timeChange', currentTime.value);
// });
// watch(currentTime, (v) => {
//     emit('timeChange', v)
// })

//自动播放
const widthPerSecond = computed(() => unref(width) / unref(totalSeconds)); //每秒宽度
// const speedOptions = [1, 5, 10, 15];
const speedIcons = {
  1: speed,
  5: speed,
  10: speed10,
  15: speed15,
};
const speedOptions = [0.5, 1.0, 1.5, 2.0, 5.0, 10];
const activeSpeed = inject(playSpeedKey, ref(1.0));
watch(activeSpeed, (speed) => {
  emit("speedChange", speed);
});
const playSpeed = ref(speedOptions[0]);

function changePlaySpeed() {
  const idx = speedOptions.indexOf(unref(playSpeed));
  playSpeed.value = speedOptions[(idx + 1) % speedOptions.length];
}
// let isPlaying = ref(false);
const isPlaying = inject(isPlayingKey, ref(false));
let animationFrameId: number | null = null;
// function play() {
//     isPlaying.value = true;
//     // console.log('快速的减肥框架', unref(playSpeed));
//     // left.value = Math.max(0, Math.min(left.value + (widthPerSecond.value / FPS.value) * unref(playSpeed), width.value));
//     // if (left.value >= width.value) pause();
//     // animationFrameId = requestAnimationFrame(play);
// }
// function pause() {
//     isPlaying.value = false;
//     // if (!animationFrameId) return;
//     // cancelAnimationFrame(animationFrameId);
//     // animationFrameId = null;
// }
//快进
const stepSeconds = 10; //步长秒数
function FastForward() {
  left.value = Math.min(
    left.value + widthPerSecond.value * stepSeconds,
    width.value
  );
  emitTimeChange();
}
//后退
function Rewind() {
  left.value = Math.max(left.value - widthPerSecond.value * stepSeconds, 0);
  emitTimeChange();
}

//canvas绘制
const events = ref([
  { time: "2023-09-10 00:04:00", type: "info", desc: "小偷进来了" },
  { time: "2023-09-10 00:04:12", type: "warning", desc: "" },
  { time: "2023-09-10 00:04:13", type: "info", desc: "" },
  { time: "2023-09-11 00:03:13", type: "info", desc: "" },
  { time: "2023-09-09 00:01:20", type: "info", desc: "" },
  { time: "2023-09-12 00:02:11", type: "warning", desc: "" },
]);
const dateLine = ref<HTMLCanvasElement>();
const eventsLine = ref<HTMLCanvasElement>();
onMounted(() => {
  drawDashed(dateLine);
  // drawEvents(eventsLine, unref(events), unref(startTime), unref(endTime));
});

//重置进度条、重绘事件、播放暂停
function resetProgress() {
  drawEvents(eventsLine, unref(events), startTime.value, endTime.value);
  left.value = 0;
  // pause();
}
</script>

<style scoped>
.isGradient {
  background: linear-gradient(
    270deg,
    rgba(68, 118, 227, 0.8) 0%,
    rgba(77, 197, 145, 0) 100%
  );
  box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.16);
}
.triangle::after {
  content: "";
  position: absolute;
  left: 0;
  transform: translateX(-100%);
  width: 0;
  height: 0;
  border-right: 7px solid rgb(68, 118, 227);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}
:deep(.n-input:not(.n-input--autosize)) {
  background-color: rgba(0, 0, 0, 0);
}
:deep(.n-input .n-input__input-el) {
  color: white;
}
:deep(.n-input .n-input__suffix) {
  display: none;
}
:deep(.n-input .n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
}
</style>
