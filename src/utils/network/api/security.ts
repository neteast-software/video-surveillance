import Pack from "../pack";
import { format } from "date-fns";
import type {
	MonitorRegionOption,
	GetRegionPersonFlowResult,
	MonitorListItem,
	MonitorItem,
} from "../types/security";
const pack = new Pack({ scope: "security" });
// 获取视频列表
export const getMonitorList = async (regionIndexCode?: number) => {
	const { data } = await pack.get<{ data: MonitorListItem[] }>(
		"/video/home/getVideoList",
		{
			regionIndexCode: regionIndexCode || "",
		}
	);
	return data.value!;
};
// 获取下拉框列表
export const getMonitorRegionOptions = async () => {
	const { data } = await pack.get<{ data: MonitorRegionOption[] }>(
		"/video/home/getRegionSelectList"
	);
	return data.value!;
};
// 获取视频流链接
export const getMonitorInfo = async (indexCode: string, protocol = "rtsp") => {
	const { data } = await pack.get<{ data: MonitorItem }>(
		`/video/pointInfo/getPreviewURLs/${indexCode}`,
		{
			protocol,
		}
	);
	return data.value!;
};
// 获取默认视频列表
export const getDefaultMonitorList = async () => {
	const { data } = await pack.get<{ data: MonitorItem[] }>(
		"/video/pointInfo/defaultList"
	);
	return data.value!;
};

// 云控制台指令
export const controlMonitor = async (indexCode: string, command: string) => {
	const { data } = await pack.get(
		`/video/pointInfo/ptzs/controlling/${indexCode}/${command}`
	);
	return data.value!;
};

// 设置预置点
// export const setPresetPoint = async (indexCode: string) => {
//     const { data } = await pack.get(`/video/pointInfo/presets/${indexCode}`);
//     return data.value!;
// };

interface getServerWebRTCParams {
	offer: string;
	url?: string;
	startTime?: string;
	endTime?: string;
	isRecord?: boolean;
	clientID: string;
}
// 获取服务端webrtc的sdp
export const getServerWebRTC = async (params: getServerWebRTCParams) => {
	const { data } = await pack.post(
		"/rtc/videoStream",
		{ ...params },
		{ withoutLock: true }
	);
	return data.value!;
};

// 登录接口
export const login = async (accessToken: string) => {
	const { data } = await pack.get<{ data: string }>("/access/login", {
		accessToken,
	});
	return data.value!;
};

// 心跳接口
export const heartBeat = async () => {
	await pack.get("/access/ping");
};

export interface ChannelItem {
	id: number;
	channelName: string;
	channelNum: string;
	online: boolean;
	imgAddr?: string;
	labels?: string[];
	rtspPort?: number;
}
export interface NVRItem {
	id: number;
	name: string;
	channels: ChannelItem[] | null;
	online: boolean;
}
// 获取设备信息
export const getDevicesList = async () => {
	const { data } = await pack.get<{ data: NVRItem[] }>(
		"/hikDevices/devicesInfo"
	);
	return data.value!;
};

// 播放试试视频流
export const getRealtimeVideo = async (
	nvrId: number,
	channelNum: number,
	offer: string
) => {
	const { data } = await pack.post(`/video/play/${nvrId}/${channelNum}`, {
		offer,
	});
	return data.value!;
};

export const getRecordVideo = async (
	nvrId: number,
	channelNum: number,
	offer: string,
	startTime: string,
	endTime: string,
	clientID?: string,
	ts?: number,
	scale = 1.0
) => {
	const { data } = await pack.post(`/video/backPlay/${nvrId}/${channelNum}`, {
		offer,
		startTime,
		endTime,
		clientID,
		ts,
		scale,
	});
	return data.value;
};

// 测试本地倍速
export const testRecordRatio = async (
	id: string,
	url: string,
	offer: string,
	clientID: string,
	ts: number,
	scale = 1.0
) => {
	const { data } = await pack.post("/rtc/videoStream", {
		id,
		url,
		offer,
		clientID,
		ts,
		isRecord: true,
		scale,
	});
	return data.value!;
};

// 云控制台
export const cloudControl = async (
	id: number,
	channel: number,
	dwPTZCommand: string,
	dwStop?: 0 | 1
) => {
	await pack.post(
		"/ptz/control",
		{ id, channel, dwPTZCommand, dwStop },
		{ isSync: true }
	);
};
// 云控制台，开始
export const startControl = async (
	id: number,
	channel: number,
	dwPTZCommand: string
) => {
	await pack.post("/ptz/play", { id, channel, dwPTZCommand });
};
// 云控制台，停止
export const stopControl = async (
	id: number,
	channel: number,
	dwPTZCommand: string
) => {
	await pack.post("", { id, channel, dwPTZCommand });
};

// 播放hls
export const postVideoStreamHls = async (nvrId: number, channelNum: number) => {
	const { data } = await pack.post<{ data: { uri: string; port: number } }>(
		`/video/playHls/${nvrId}/${channelNum}`
	);
	return data.value;
};

// 获取视频编码格式
export const getVideoEncode = async (nvrId: number, channelNum: number) => {
	const { data } = await pack.post<{ data: number }>(
		`/video/getVideoEncoding/${nvrId}/${channelNum}`
	);
	return data.value;
};

// 设置预置点
export const setPresetPoint = async (
	nvrId: number,
	channelNum: number,
	command = 8,
	index = 1
) => {
	await pack.post("/ptz/setPreset", {
		id: nvrId,
		channel: channelNum,
		command,
		index,
	});
};

// 去预置点
export const gotoPresetPoint = async (
	nvrId: number,
	channelNum: number,
	command = 39,
	index = 1
) => {
	await pack.post("/ptz/setPreset", {
		id: nvrId,
		channel: channelNum,
		command,
		index,
	});
};

// 清除预置点
export const clearPresetPoint = async (
	nvrId: number,
	channelNum: number,
	command = 9,
	index = 1
) => {
	await pack.post("/ptz/setPreset", {
		id: nvrId,
		channel: channelNum,
		command,
		index,
	});
};

// 获取预置点信息
export const getPresetPoint = async (nvrId: number, channelNum: number) => {
	const { data } = await pack.get(
		`/hikDevices/getChannelPreset/${nvrId}/${channelNum}`
	);
	return data.value!;
};

// 获取设备通道视频编码信息
export const getChannelEncode = async (nvrId: number, channelId: number) => {
	const { data } = await pack.get<{ data: { encType: string } }>(
		`/config/getChannelVideoEncType/${nvrId}/${channelId}`
	);
	return data.value!;
};

// 设置设备通道视频编码信息
export const setChannelEncode = async (id: number, channelNum: number) => {
	const { data } = await pack.post("/config/setChannelVideoEncType", {
		id: Number(id),
		channelId: Number(channelNum),
		videoEncType: 1,
	});
	return data.value!;
};

// 重启NVR设备
export const rebootNVR = async (id: number) => {
	const { data } = await pack.post("/config/setDeviceReboot", { id });
	return data.value!;
};
