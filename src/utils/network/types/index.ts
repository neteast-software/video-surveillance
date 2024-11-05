export interface MyListParams {
  category?: string;
  pageSize?: string;
  pageNum?: string;
}
export interface Record {
  title: string;
  img: any;
  content: string;
  source: string;
  level: number;
  deviceId: number;
  deviceName: string;
  happenTime: string;
  category: number;
  type: string;
  typeLabel: string;
}

export interface MyList {
  records: Record[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  searchCount: boolean;
  maxLimit: any;
  countId: any;
  pages: number;
}

export interface LastAlarm {
  num: number;
  title: string;
  happenTime: string;
}

export interface AlarmCategory {
  category: string;
  value: string;
  num: number;
}

export interface OnlineRate {
  safetyHelmetVos: {
    img?: string;
    name: string;
  }[];
  safetyHelmetRate: number;
  channelRate: number;
}
