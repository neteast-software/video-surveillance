import http from "../http";
import type { NVRItem } from "../types/monitor";

//获取播放设备列表信息
export const getDevicesList = async () => {
  const { data } = await http.get<{ data: NVRItem[] }>(
    "/v2/hikDevices/devicesInfo"
  );
  return data.value!;
};
// 播放实时视频流
export const getRealtimeVideo = async (
  nvrId: number,
  channelId: number,
  offer: string
) => {
  const { data } = await http.post(`/v2/video/play/${nvrId}/${channelId}`, {
    offer,
  });
  return data.value!;
};

// // 获取设备通道视频编码信息
// export const getChannelEncode = async (nvrId: number, channelNum: number) => {
//   const { data } = await http.get<{ data: { encType: number } }>(
//     `/config/getChannelVideoEncType/${nvrId}/${channelNum}`
//   );
//   return data.value!;
// };

//播放回放视频流
export const getRecordVideo = async (
  nvrId: number,
  channelId: number,
  offer: string,
  startTime: string,
  endTime: string,
  clientID?: string,
  ts?: number,
  scale = 1.0
) => {
  const { data } = await http.post(`/v2/video/backPlay/${nvrId}/${channelId}`, {
    offer,
    startTime,
    endTime,
    clientID,
    ts,
    scale,
  });
  return data.value;
};
