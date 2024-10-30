import http from "../http";
import type {
  StatusTotal,
  DeviceStatus,
  ChartData,
  AlarmTrend,
  HistoryEvent,
  HasAlarmByDate,
  AlarmList,
} from "../types/statusMonitor";

//获取监控状态/安全帽状态
export const getStatusTotal = async (deviceType: number) => {
  const { data } = await http.get<{ data: StatusTotal }>(
    `/v2/index/deviceOnlineAlarm/${deviceType}`
  );
  return data.value!;
};

//获取设备状态
export const getDeviceStatus = async (deviceType: string) => {
  const { data } = await http.get<{ data: DeviceStatus }>(
    `/v2/index/deviceStatus/`,
    { deviceType }
  );
  return data.value!;
};
//获取设备类型告警数量
export const getAlarmCount = async () => {
  const { data } = await http.get<{ data: ChartData }>("/v2/index/alarmCount");
  return data.value!;
};
//告警事件趋势
export const getAlarmTrend = async (source?: string, category?: number) => {
  const params: Record<string, any> = {};
  if (source !== undefined && source !== "0") params.source = source;
  if (category !== undefined && category !== 0) params.category = category;
  const { data } = await http.get<{ data: AlarmTrend[] }>(
    "/v2/index/alarmTrend",
    params
  );
  return data.value!;
};

//历史事件列表
export const getHistoryEvent = async (source?: string, category?: number) => {
  const params: Record<string, any> = {};
  if (source !== undefined && source !== "0") params.source = source;
  if (category !== undefined && category !== 0) params.category = category;
  const { data } = await http.get<{ data: HistoryEvent }>(
    "/v2/index/historyEvent",
    params
  );
  return data.value!;
};

//根据日期获取是否有告警信息
export const getHasAlarmByDate = async (startDate: string, endDate: string) => {
  const { data } = await http.get<{ data: HasAlarmByDate[] }>(
    `/v2/index/hasAlarmByDate`,
    { startDate, endDate }
  );
  return data.value!;
};

interface AlarmListParams {
  deviceId?: number;
  happenTime?: string;
  category?: string;
}

//获取告警事件列表
export const getAlarmList = async (params: AlarmListParams) => {
  const { data } = await http.get<{ data: AlarmList[] }>(
    "/v2/index/alarmList",
    params
  );
  return data.value!;
};
