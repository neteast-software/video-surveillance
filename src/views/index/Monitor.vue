<template>
  <div class="w-full relative h-full">
    <div class="absolute top-0 left-0 w-full h-full">
      <template v-if="id">
        <template v-if="!rebooting">
          <WebRTCPlayer
            v-if="!refresh"
            ref="webrtc"
            :controls="controls"
            class="rounded overflow-hidden"
            :clientID="id"
            :nvrId="nvrId"
            :channelId="channelId"
            @set-preset="setPreset(nvrId, channelId)"
            @to-preset="gotoPresetPoint(nvrId, channelId)"
            @clear-preset="clearPreset(nvrId, channelId)"
            @command="
              (cmd, flag) => cloudControl(nvrId, channelId, CMD[cmd], flag)
            "
          >
            <template
              #[slotName]="props"
              v-for="(_, slotName) in $slots"
              :key="slotName"
            >
              <slot :name="slotName" v-bind="props"></slot>
            </template>
            <template #historyRight>
              <button
                v-if="chName"
                class="absolute right-0 whitespace-nowrap text-white z-50 bg-grey/20 h-10 px-4 rounded-full"
              >
                <span v-if="nvrName">{{ nvrName }} | </span>{{ chName }}
              </button>
            </template>
            <template #middle-right>
              <ControlButton
                v-if="!isH264"
                :icon="visualization"
                @click="restartNVR(nvrId)"
                >重启NVR</ControlButton
              >
              <ControlButton
                v-if="!isH264"
                :icon="translate"
                @click="setH264Codec(nvrId, channelId)"
                >切换H264</ControlButton
              >
            </template>
          </WebRTCPlayer>
        </template>
        <template v-else>
          <div class="w-full h-full bg-black">
            <NSpin
              class="absolute-center"
              :show="true"
              description="重启设备中"
            >
            </NSpin>
          </div>
        </template>
        <HlsPlayer
          v-else
          :controls="controls"
          :nvr-id="nvrId"
          :channel-id="channelId"
          :clientID="id"
          @command="
            (cmd, flag) => cloudControl(nvrId, channelId, CMD[cmd], flag)
          "
        ></HlsPlayer>
      </template>
      <template v-else>
        <div
          class="relative w-full h-full bg-black rounded overflow-hidden"
        ></div>
      </template>
      <button
        v-if="chName"
        :class="{ hidden: webrtc?.controller?.historySwitch }"
        class="absolute z-1 right-4 text-white z-50 bg-black/50 h-10 px-4 rounded-full flex-center gap-1"
        :style="{ bottom: controls ? '100px' : '14px' }"
      >
        <img :src="positionImg" mode="scaleToFill" class="w-4 h-4" />
        <span v-if="nvrName">{{ nvrName }} | </span>{{ chName }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import positionImg from "@/icons/position.svg";
import WebRTCPlayer from "@/components/video/WebRTCPlayer.vue";
import HlsPlayer from "@/components/video/HlsPlayer.vue";
import {
  cloudControl,
  getChannelEncode,
  setChannelEncode,
  rebootNVR,
} from "@/utils/network/api/security";
import { CMD } from "./helper";
import { nextTick, onMounted, provide, ref, watch } from "vue";
import {
  setPresetPoint,
  gotoPresetPoint,
  getPresetPoint,
  clearPresetPoint,
} from "@/utils/network/api/security";
import ControlButton from "@/components/video/ControlButton.vue";
import { useDialogAsync } from "@/components/dialog";
import { translate, visualization } from "@/assets/icons";
import { NSpin } from "naive-ui";
import { timeoutPromise } from "@/utils/other";
const { confirmDialog } = useDialogAsync();
interface Props {
  id: string;
  nvrId: number;
  channelId: number;
  nvrName: string;
  chName: string;
  controls?: boolean;
  isFullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
defineEmits(["showHistory"]);
const webrtc = ref<InstanceType<typeof WebRTCPlayer>>();
const havePreset = ref(false);
provide("havePreset", havePreset);
async function initData() {
  if (!props.nvrId) return;
  const res = await getPresetPoint(props.nvrId, props.channelId);
  havePreset.value = !!res.data?.preset;
}
onMounted(initData);
const isH264 = ref(true);
async function getCodec() {
  if (!props.nvrId) return;
  if (!props.controls) return;
  const { data } = await getChannelEncode(props.nvrId, props.channelId);
  const { encType } = data;
  isH264.value = encType === 1;
  console.log("获取到的codec", encType, isH264.value);
}
watch(() => props.controls, getCodec);
async function setH264Codec(nvrId: number, channelId: number) {
  await setChannelEncode(nvrId, channelId);
  await confirmDialog({
    type: "success",
    title: "确认",
    content:
      "切换H264成功，重启设备后生效。点击确定进行重启, 或者点击取消关闭对话框",
    positiveText: "重启NVR",
    negativeText: "取消",
  });
  restartNVR(nvrId);
}
const refresh = ref(false);
const rebooting = ref(false);
watch(refresh, (val) => {
  if (val) getCodec();
});
async function restartNVR(id: number) {
  await confirmDialog({
    title: "确认",
    content: "确定要重启设备吗？",
  });
  try {
    rebooting.value = true;
    await rebootNVR(id);
    await timeoutPromise(6 * 1000);
    window.$message?.success("重启设备成功");
    refresh.value = true;
    await nextTick();
    refresh.value = false;
  } finally {
    rebooting.value = false;
  }
}

async function setPreset(nvrId: number, channelId: number) {
  await setPresetPoint(nvrId, channelId);
  window.$message?.success("设置预置点成功");
  havePreset.value = true;
}

async function clearPreset(nvrId: number, channelId: number) {
  await clearPresetPoint(nvrId, channelId);
  window.$message?.success("清除预置点成功");
  havePreset.value = false;
}
</script>

<style scoped>
.pb100 {
  /* padding-bottom: 100%; */
  height: 100%;
}
.pb60 {
  padding-bottom: 60%;
}
</style>
