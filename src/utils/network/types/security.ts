export interface MonitorListItem {
  id: number;
  name: string;
  online: 0 | 1;
  picUrl: string;
  indexCode: string;
  regionName: string;
}
export interface MonitorItem {
  key: string;
  nvrId: number;
  nvrName: string;
  channelId: number | string;
  channelName: string;
  online: boolean;
}
export interface MonitorRegionOption {
  rigionName: string;
  rigionType: string;
  rigionIndexCode: string;
  parentIndexCode: string;
  childrenList: MonitorRegionOption[];
}
export interface GetRegionPersonFlowResult {
  data: {
    type: string;
    dataBody: {
      title: string;
      abscissa: string[];
    };
  };
}
export interface DefaultMonitorListItem {}
