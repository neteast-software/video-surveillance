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
				style="object-fit: contain"
				preload="auto"
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
let RefreshTimer: NodeJS.Timeout;
useEventListener(videoEl, "waiting", () => {
	clearTimeout(RefreshTimer);
	RefreshTimer = setTimeout(() => {
		console.log("触发自动刷新");
		createPc();
	}, 10000);
});
useEventListener(videoEl, "loadedmetadata", (ev: Event) => {
	clearTimeout(RefreshTimer);
	if (videoEl.value.paused) {
		videoEl.value.play();
	}
});

useEventListener(videoEl, "error", (err) => {
	console.log("出现错误了", err);
	isRecordPlaying.value = false;
});
watch(isRecordPlaying, (val) => {
	if (!videoIsReady.value) return;
	if (!isRecord.value) return;
	const el = unref(videoEl);
	if (!el) return;
	val ? el.play() : el.pause();
});
// webrtc
let pc: RTCPeerConnection | null = null;
let lastTimeStamp = 0;
let retryCount = 0;
let retryLimit = 5;
let stream: MediaStream | null = null;

function createPc() {
	if (retryCount >= retryLimit) {
		return null;
	}
	destroyPc();
	console.log("新建rtc连接");
	videoIsReady.value = false;
	if (isRecord.value) {
		isRecordPlaying.value = false;
	}
	pc = new RTCPeerConnection();
	const ts = Date.now();
	lastTimeStamp = ts;
	pc.oniceconnectionstatechange = (ev) => {
		console.log("ice状态", pc?.iceConnectionState);
	};

	pc.onnegotiationneeded = () => negotiate(ts);
	pc.addTransceiver("video", {
		direction: "recvonly",
	});
	pc.addTransceiver("audio", {
		direction: "recvonly",
	});
	stream = new MediaStream();
	pc.ontrack = (event) => {
		const kind = event.track.kind;
		const trackType = stream.getTracks().map((t) => t.kind);
		if (trackType.includes(kind)) {
			stream.getTracks().forEach((track) => {
				if (track.kind == kind) {
					console.log("更新了轨道", track.kind);
					stream.removeTrack(track);
				}
			});
		}
		stream.addTrack(event.track);

		if (videoEl.value.played) {
			//避免AbortError
			videoEl.value.pause();
			videoEl.value.srcObject = null;
		}

		videoEl.value.srcObject = stream;
		if (videoEl.value.paused && trackType.length >= 1) {
			videoEl.value.load();
			videoEl.value.volume = 1;
		}
		console.log(
			"拥有轨道",
			stream.getTracks().map((t) => t.kind)
		);
	};
	pc.onconnectionstatechange = (ev) => {
		const state = pc?.connectionState;
		if (!state) return;
		switch (state) {
			case "connecting":
				console.log(props.nvrId, props.channelId, "连接中");
				break;
			case "failed":
			case "disconnected":
				if (isRecord.value) isRecordPlaying.value = false;
				retryCount++;
				console.log("断线重试", retryCount);
				createPc();
				break;
			case "connected":
				console.log("webrtc连接成功");
				videoIsReady.value = true;
				webRTCError.value = "";
				retryCount = 0;
				if (videoEl.value.paused) {
					videoEl.value?.play();
				}
				break;
			default:
				console.log("新的事件", state);
				break;
		}
	};
	return pc;
}
createPc();
const startTime = ref(format(startOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"));
const endTime = ref(format(endOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"));

const webRTCError = ref("");
async function negotiate(ts: number) {
	webRTCError.value = "";
	let data: any;
	try {
		const offer = await pc!.createOffer();
		await pc!.setLocalDescription(offer);
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
		} else {
			data = await getRealtimeVideo(
				props.nvrId,
				props.channelId,
				btoa(pc!.localDescription!.sdp),
				props.controls ? "01" : "02"
			);
		}
	} catch (err) {
		console.error("webRTC error", err);
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
	if (pc) {
		pc.setRemoteDescription(
			new RTCSessionDescription({ type: "answer", sdp: answer })
		);
	}
}
const scale = ref(1.0);
const onSpeedChange = useDebounceFn((speed: number) => {
	if (!isRecord.value) return;
	const time = addSeconds(new Date(startTime.value), recordTimer.value);
	startTime.value = format(time, "yyyy-MM-dd HH:mm:ss");
	endTime.value = format(endOfDay(time), "yyyy-MM-dd HH:mm:ss");
	recordTimer.value = 0;
	scale.value = speed;
	createPc();
}, 200);
const onRecordTimeChange = useDebounceFn((time: Date) => {
	if (!isRecord.value) return;
	startTime.value = format(time, "yyyy-MM-dd HH:mm:ss");
	endTime.value = format(endOfDay(time), "yyyy-MM-dd HH:mm:ss");
	recordTimer.value = 0;
	createPc();
}, 200);
function destroyPc() {
	if (!pc) {
		return;
	}
	stream.getTracks().forEach((track) => {
		track.stop();
	});
	pc.close();
	pc = null;
	// console.log("destroy pc这里执行到了");
}
watch(isRecord, (val) => {
	if (val) return;
	createPc();
});
watch(
	() => props.channelId,
	(val) => {
		createPc();
		// console.log("新的通道流", props.channelId);
	}
);
onBeforeUnmount(() => {
	destroyPc();
	pc = null;
	stream = null;
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
