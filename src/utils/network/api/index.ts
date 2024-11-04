import http from "../http";
import type { MyList, LastAlarm, AlarmCategory } from "../types/index";

//我的告警通知
export const getMyList = async (category: string) => {
  const params: Record<string, any> = {};
  if (category !== undefined && category !== "") params.category = category;
  const { data } = await http.get<{ data: MyList }>("/notice/myList", {
    ...params,
  });
  return data.value!;
};

//获取最新一条告警
export const getLastAlarm = async () => {
  const { data } = await http.get<{ data: LastAlarm }>("/v2/index/lastAlarm");
  return data.value!;
};

//告警类目及数量
export const getAlarmCategory = async (type?: string) => {
  const params: Record<string, any> = {};
  if (type) params.type = type;
  const { data } = await http.get<{ data: AlarmCategory[] }>(
    "/v2/index/alarmCategory",
    { ...params }
  );
  return data.value!;
};
