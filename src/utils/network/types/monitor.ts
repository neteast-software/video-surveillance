export interface ChannelItem {
  id: number;
  channelNum: string;
  channelName: string;
  online: boolean;
  imgAddr?: string;
  labels?: string[];
  //   rtspPort?: number;
}
export interface NVRItem {
  id: number;
  name: string;
  online: boolean;
  channels: ChannelItem[] | null;
}
