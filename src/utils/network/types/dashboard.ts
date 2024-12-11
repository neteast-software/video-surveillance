import type { lineSource } from "@/components/chart/LineChart.vue";

export interface AllDevices {
	id: number;
	name: string;
	durationOnline: number; // 在线时长
	resolution: string; // 分辨率
	status: string; // 状态
	manufacturer: string; // 制造商
	compression: string; // 压缩
	lng: string;
	lat: string;
	address: string;
	serialNo: string; // 序列号
	alarmInfo: {
		type: string;
		time: string;
		content: string;
		title: string;
		img: string;
	}; // 报警信息
	img: string; // 图片
	responsible: string; // 负责人
	type: string; // 类型
	time?: string; // 时间
	nvrId?: number;
}

export interface DeviceDetail {
	id: number;
	name: string;
	durationOnline: number; // 在线时长
	resolution: string; // 分辨率
	status: string; // 状态
	manufacturer: string; // 制造商
	compression: string; // 压缩
	lng: string;
	lat: string;
	address: string;
	serialNo: string; // 序列号
	alarmInfos: string;
	responsible: string; // 负责人
	type: string;
	echartsData: {
		type: string;
		dataBody: lineSource;
	};
}
