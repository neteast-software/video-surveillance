import type { PieSource } from "@/components/chart/PieChart.vue";

export interface StatusTotal {
  onlineCount: number;
  alarmCount: number;
  alarmRate: number;
}

export interface ChartData {
  type: string;
  dataBody: {
    title: string;
    dataList: PieSource;
  };
}
export interface DeviceStatus {
  total: number;
  online: number;
  offline: number;
  chartData: ChartData;
}

export interface AlarmTrend {
  date: string;
  alarmCount: number;
}
export interface HistoryEvent {
  type: number;
  dataBody: lineSource;
}
export interface lineSource {
  title: string;
  abscissa: string[];
  dataList: { name: string; value: number[] | number }[];
  dataValueType: number;
}

export interface HasAlarmByDate {
  date: string;
  hasAlarm: boolean;
}

export interface AlarmList {
  title: string;
  img: string | null;
  content: string;
  source: number;
  level: number;
  deviceId: number;
  deviceName: string;
  happenTime: string;
  category: number;
}
