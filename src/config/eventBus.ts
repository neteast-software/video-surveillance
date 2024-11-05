import { EventBusKey } from "@vueuse/core";
// 定义缩放相关的事件键
export const zoomKey: EventBusKey<[number, number]> = Symbol("zoom"); // 缩放
export const zoomUpdateKey: EventBusKey<number> = Symbol("zoomUpdate"); // 缩放更新

export const zoomInEvent = "zoomInEvent";
export const zoomOutEvent = "zoomOutEvent";

// 定义滚动列表和定位标记点的事件键
export const scrollToItemKey: EventBusKey<number> = Symbol("scrollToItem"); // 滚动到列表项
export const flyToPositionKey: EventBusKey<number> = Symbol("flyToPosition"); // 定位到标记点
