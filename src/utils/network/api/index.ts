import http from "../http";
import type {
  MyList,
  LastAlarm,
  AlarmCategory,
  MyListParams,
  OnlineRate,
} from "../types/index";

//我的告警通知
export const getMyList = async (params: MyListParams) => {
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

//左侧菜单栏数据
export const getOnlineRate = async () => {
  const { data } = await http.get<{ data: OnlineRate }>("/v2/index/onlineRate");
  return data.value!;
};
