<template>
    <div class="relative w-full h-full" :id="id">
        <VideoPlayer
            class="w-full h-full vjs-big-play-centered"
            ref="player"
            autoplay
            :muted="isMuted"
            :sources="sources"
            :controls="false"
            @canplay="console.log('可以播放啦')"
            @play="onPlay"
            @timeupdate="onTimeUpdate"
        ></VideoPlayer>
        <ControlsBar
            v-if="controls"
            v-model:muted="isMuted"
            class="absolute left-0 bottom-0 w-full h-23"
            @audio-change="isMuted = $event"
            @fullscreen="enter"
            @command="(cmd, flag) => $emit('command', cmd, flag)"
            @record="startRecord"
            @stop-record="stopRecord"
            @add-preset="$emit('add-preset', $event)"
            @screenshot="capture"
            @time-change="onRecordTimeChange"
        ></ControlsBar>
    </div>
</template>

<script setup lang="ts">
import ControlsBar from './ControlsBar.vue';

import { VideoPlayer, VideoPlayerProps } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import { ref, computed, onMounted, provide } from 'vue';
import { postVideoStreamHls } from '@ebuild/utils/network/api/security';
import { useFullscreen, useNow } from '@vueuse/core';
import RecordRTC from 'recordrtc';
import { format, differenceInMilliseconds } from 'date-fns';
import { downloadFile } from '@ebuild/utils/other';
import { recordTimerKey, isReadyKey, isPlayingKey, isRecordKey } from './helper';

interface Props {
    id: string;
    nvrId: number;
    channelId: number;
    controls: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
    defineEmits<{
    'add-preset': [];
    command: [value: string, flag: number];
}>();


const player = ref<HTMLElement>();
const isMuted = ref(true);
const videoIsReady = ref(false);
const isRecord = ref(false)
const isRecordPlaying = ref(false);
const recordTimer = ref(0);
provide(isReadyKey, videoIsReady);
provide(isRecordKey, isRecord);
provide(isPlayingKey, isRecordPlaying);
provide(recordTimerKey, recordTimer);

function onPlay() {
    videoIsReady.value = true;
}

function onTimeUpdate() {
    
}


const url = ref('');
const sources = computed<VideoPlayerProps['sources']>(() => {
    if (!url.value) return [];
    return [
        {
            src: url.value,
            type: 'application/x-mpegURL'
        }
    ];
});
async function initVideo() {
    const { data } = await postVideoStreamHls(props.nvrId, props.channelId);
    console.log('初始化播放器', data);
    url.value = `http://127.0.0.1:${data.port}${data.uri}`;
}
onMounted(initVideo);

const { enter } = useFullscreen(player);

// 录屏工具
let recorder: any | null = null;
const now = useNow();
const startPoint = ref<Date | null>(null);
const recordDuration = computed(() => {
    if (!startPoint.value) return;
    return format(differenceInMilliseconds(now.value, startPoint.value), 'mm:ss');
});

function startRecord() {
    const videoEl = document.querySelector<HTMLVideoElement>(`#${props.id} video`);
    if (!videoEl) return;
    startPoint.value = new Date();
    const mediaStream = videoEl.captureStream();
    recorder = new RecordRTC(mediaStream, { type: 'video' });
    recorder.startRecording();
}
function stopRecord() {
    startPoint.value = null;
    recorder.stopRecording(() => {
        const url = URL.createObjectURL(recorder.getBlob());
        const time = new Date().getTime();
        const filename = `${time}.mp4`;
        downloadFile(url, filename);
        recorder = null;
        window.$message?.success('录制结束');
    });
}

// 截图工具
function capture() {
    const videoEl = document.querySelector<HTMLVideoElement>(`#${props.id} video`);
    if (!videoEl) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const screenshotURL = canvas.toDataURL();
    downloadFile(screenshotURL, 'screenshot.png');
    window.$message?.success('截图成功');
}
</script>

<style scoped></style>
