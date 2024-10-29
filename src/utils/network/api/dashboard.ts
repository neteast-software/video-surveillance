import http from "../http";
// import Pack from "../pack";
import type { AllDevices, DeviceDetail } from "../types/dashboard";
// const pack = new http();

//获取数量统计
export const getOnlineStatistics = async () => {
  const { data } = await http.get("/v2/index/onlineStatistics");
  return data.value!;
};
//获取全部设备列表
export const getAllDevices = async () => {
  const { data } = await http.get<{ data: AllDevices[] }>(
    "/v2/index/allDevices"
  );
  return data.value!;
};

//获取设备详情
export const getDeviceDetail = async (deviceId: number) => {
  const { data } = await http.get<{ data: DeviceDetail }>(
    `/v2/index/deviceDetail/${deviceId}`
  );
  return data.value!;
};

//今日事件，近30天事件统计
export const getEventStatistics = async () => {
  const { data } = await http.get("/v2/index/eventStatistics");
  return data.value!;
};
