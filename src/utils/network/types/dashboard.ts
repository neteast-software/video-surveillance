export interface AllDevices {
  id: number;
  name: string;
  durationOnline: number; // 在线时长
  resolution: string; // 分辨率
  status: number; // 状态
  manufacturer: string; // 制造商
  compression: string; // 压缩
  lng: string;
  lat: string;
  address: string;
  serialNo: string; // 序列号
  alarmInfo: string; // 报警信息
  responsible: string; // 负责人
  type: number; // 类型
}
