<template>
	<div class="relative w-full h-full">
		<div
			v-if="recordDuration"
			class="flex items-center absolute left-1/2 -translate-x-1/2 py-2 px-4 rounded-full bg-black/50 top-4"
		>
			<div class="w-2.5 h-2.5 rounded-full bg-error mr-2"></div>
			<span class="text-white text-xs">{{ recordDuration }}</span>
		</div>
		<div class="w-full h-full bg-black relative">
			<video
				:muted="isMuted"
				:controls="false"
				ref="videoEl"
				:autoplay="true"
				class="w-full h-full"
				style="object-fit: fill"
			></video>
			<slot></slot>
			<NSpin
				v-if="!videoIsReady || webRTCError"
				class="absolute-center"
				:description="webRTCError"
			></NSpin>
		</div>
		<ControlsBar
			v-if="controls"
			ref="controller"
			v-model:muted="isMuted"
			class="absolute left-0 bottom-0 w-full h-23"
			@audio-change="isMuted = $event"
			@fullscreen="enter"
			@command="(cmd, flag) => $emit('command', cmd, flag)"
			@record="videoIsReady && startRecord()"
			@stop-record="videoIsReady && stopRecord()"
			@add-preset="$emit('add-preset', $event)"
			@set-preset="$emit('setPreset')"
			@to-preset="$emit('toPreset')"
			@clear-preset="$emit('clearPreset')"
			@screenshot="videoIsReady && capture()"
			@speed-change="onSpeedChange"
			@time-change="onRecordTimeChange"
			@pip="videoEl.requestPictureInPicture()"
		>
			<template
				#[slotName]="props"
				v-for="(_, slotName) in $slots"
				:key="slotName"
			>
				<slot :name="slotName" v-bind="props"></slot>
			</template>
		</ControlsBar>
	</div>
</template>

<script setup lang="ts">
import ControlsBar from "./ControlsBar.vue";
import {
	computed,
	ref,
	provide,
	unref,
	watch,
	onBeforeUnmount,
	onMounted,
} from "vue";
import {
	useEventListener,
	useFullscreen,
	useNow,
	useDebounceFn,
} from "@vueuse/core";
import RecordRTC from "recordrtc";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { downloadFile } from "@/utils/other";
import {
	format,
	differenceInMilliseconds,
	endOfDay,
	startOfDay,
	addSeconds,
} from "date-fns";
import { NSpin } from "naive-ui";
import { getRealtimeVideo, getRecordVideo } from "@/utils/network/api/monitor";
import {
	recordTimerKey,
	isReadyKey,
	isPlayingKey,
	isRecordKey,
	playSpeedKey,
} from "./helper";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
interface Props {
	nvrId: number;
	controls?: boolean;
	clientID?: string;
	channelNum: number;
	channelId: number;
}
const props = withDefaults(defineProps<Props>(), {
	clientID: uuidv4(),
});
const { selectMonitorCard } = storeToRefs(useDeviceInfoStore());
defineEmits<{
	"add-preset": [];
	command: [value: string, flag: number];
	setPreset: [];
	toPreset: [];
	clearPreset: [];
}>();
const controller = ref<InstanceType<typeof ControlsBar>>();
// const clientID = uuidv4();
// video元素相关
const videoEl = ref<HTMLVideoElement>();
const videoIsReady = ref(false);
const isMuted = ref(true);
const isRecord = ref(false);
const isRecordPlaying = ref(false);
const playSpeed = ref(1.0);
const recordTimer = ref(0);
provide(recordTimerKey, recordTimer);
provide(isReadyKey, videoIsReady);
provide(isPlayingKey, isRecordPlaying);
provide(isRecordKey, isRecord);
provide(playSpeedKey, playSpeed);
const { enter } = useFullscreen(videoEl);
useEventListener(videoEl, "play", () => {
	if (!isRecord.value) return;
	isRecordPlaying.value = true;
});
useEventListener(videoEl, "timeupdate", () => {
	if (!isRecord.value) return;
	const el = unref(videoEl);
	if (!el) return;
	recordTimer.value = el.currentTime * playSpeed.value;
});
watch(isRecordPlaying, (val) => {
	if (!videoIsReady.value) return;
	if (!isRecord.value) return;
	const el = unref(videoEl);
	if (!el) return;
	val ? el.play() : el.pause();
});

watch(selectMonitorCard, (val) => {
	if (val == props.channelId) {
		pc = createPc();
	}
});
// webrtc
let pc: RTCPeerConnection | null = null;
let lastTimeStamp = 0;
let retryCount = 0;
let retryLimit = 3;
function createPc() {
	if (retryCount >= retryLimit) {
		return null;
	}
	destroyPc();
	videoIsReady.value = false;
	if (isRecord.value) {
		isRecordPlaying.value = false;
	}
	pc = new RTCPeerConnection({
		iceServers: [{ urls: ["stun:stun4.l.google.com:19302"] }],
		// iceServers: [
		//     { urls: 'turn:116.204.75.102:3478', username: 'neteast', credential: 'as4hqnGjasdo20OEe97g1aJHKdsfsa' }
		// ]
	});
	const ts = Date.now();
	lastTimeStamp = ts;
	pc.onnegotiationneeded = () => negotiate(ts);
	pc.addTransceiver("video", {
		direction: "recvonly",
	});
	pc.addTransceiver("audio", {
		direction: "recvonly",
	});
	const stream = new MediaStream();
	pc.ontrack = (event) => {
		stream.addTrack(event.track);
		if (videoEl.value) {
			videoEl.value.srcObject = stream;
			if (videoEl.value.paused) {
				videoEl.value.play();
			}
		}
	};
	pc.onconnectionstatechange = () => {
		const state = pc?.connectionState;
		if (!state) return;
		switch (state) {
			case "failed":
				// case 'disconnected':
				if (isRecord.value) isRecordPlaying.value = false;
				retryCount++;
				createPc();
				break;
			case "connected":
				videoIsReady.value = true;
				webRTCError.value = "";
				retryCount = 0;
				// destroyPc(pc);
				break;
			default:
				break;
		}
	};
	return pc;
}
// onMounted(createPc);
pc = createPc();
const startTime = ref(format(startOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"));
const endTime = ref(format(endOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"));

const webRTCError = ref("");
async function negotiate(ts: number) {
	webRTCError.value = "";
	const offer = await pc!.createOffer();
	await pc!.setLocalDescription(offer);
	let data: any;
	try {
		if (isRecord.value) {
			console.log("录制", startTime.value, endTime.value);
			data = await getRecordVideo(
				props.nvrId,
				props.channelId,
				btoa(pc!.localDescription!.sdp),
				unref(startTime),
				unref(endTime),
				props.clientID,
				ts,
				scale.value
			);
			// data = await testRecordRatio(
			//     `${props.nvrId}-${props.channelId}`,
			//     'rtsp://admin:hk123456@112.5.140.146:554/Streaming/tracks/101?starttime=20240527t000000z&endtime=20240527t120000z',
			//     btoa(pc!.localDescription!.sdp),
			//     props.clientID,
			//     ts,
			//     scale.value
			// );
		} else {
			data = await getRealtimeVideo(
				props.nvrId,
				props.channelId,
				btoa(pc!.localDescription!.sdp),
				props.controls ? "01" : "02"
			);
		}
	} catch (err) {
		if (err === "Stream Codec not H264") {
			webRTCError.value = "不支持的视频编码";
		} else {
			if (typeof err !== "string" && retryCount < retryLimit) {
				retryCount++;
				createPc();
			}
			webRTCError.value = typeof err === "string" ? err : "无信号";
		}
		videoIsReady.value = true;
		return;
	}
	if (ts < lastTimeStamp) return;
	const answer = atob(data.answer);
	pc!.setRemoteDescription(
		new RTCSessionDescription({ type: "answer", sdp: answer })
	);
}
const scale = ref(1.0);
const onSpeedChange = useDebounceFn((speed: number) => {
	if (!isRecord.value) return;
	const time = addSeconds(new Date(startTime.value), recordTimer.value);
	startTime.value = format(time, "yyyy-MM-dd HH:mm:ss");
	endTime.value = format(endOfDay(time), "yyyy-MM-dd HH:mm:ss");
	recordTimer.value = 0;
	scale.value = speed;
	pc = createPc();
}, 200);
const onRecordTimeChange = useDebounceFn((time: Date) => {
	if (!isRecord.value) return;
	startTime.value = format(time, "yyyy-MM-dd HH:mm:ss");
	endTime.value = format(endOfDay(time), "yyyy-MM-dd HH:mm:ss");
	recordTimer.value = 0;
	// destroyPc();
	pc = createPc();
}, 200);
function destroyPc() {
	if (!pc) return;
	pc.close();
	pc = null;
}
watch(isRecord, (val) => {
	if (val) return;
	// destroyPc();
	pc = createPc();
});
watch(
	() => props.channelId,
	(val) => {
		pc = createPc();
	}
);
onBeforeUnmount(() => {
	destroyPc();
});

// 录屏工具
let recorder: any | null = null;
const now = useNow();
const startPoint = ref<Date | null>(null);
const recordDuration = computed(() => {
	if (!startPoint.value) return;
	return format(
		differenceInMilliseconds(now.value, startPoint.value),
		"mm:ss"
	);
});
function startRecord() {
	if (!videoEl.value) return;
	startPoint.value = new Date();
	const mediaStream = videoEl.value?.mozCaptureStream
		? videoEl.value!.mozCaptureStream()
		: videoEl.value!.captureStream();
	recorder = new RecordRTC(mediaStream, {
		type: "video",
		mimeType: "video/mp4",
	});
	recorder.startRecording();
}
function stopRecord() {
	startPoint.value = null;
	recorder.stopRecording((blobURL) => {
		// const url = URL.createObjectURL(recorder.getBlob());
		const time = new Date().getTime();
		// debugger;
		console.log("录制结束", blobURL);
		const filename = `${time}.mp4`;
		downloadFile(blobURL, filename);
		recorder = null;
		window.$message?.success("录制结束");
	});
}

// 截图工具
function capture() {
	if (!videoEl.value) return;
	const canvas = document.createElement("canvas");
	canvas.width = videoEl.value.videoWidth;
	canvas.height = videoEl.value.videoHeight;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.drawImage(videoEl.value, 0, 0, canvas.width, canvas.height);
	const screenshotURL = canvas.toDataURL();
	downloadFile(screenshotURL, "screenshot.png");
	window.$message?.success("截图成功");
}

defineExpose({
	isRecord,
	controller,
});
</script>

<style scoped></style>
