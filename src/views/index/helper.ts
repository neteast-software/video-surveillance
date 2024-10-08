import { MonitorItem } from "@/utils/network/types/security";
import type { EventBusKey } from "@vueuse/core";

export const pickMonitorKey: EventBusKey<MonitorItem | MonitorItem[]> =
  Symbol("pick-monitor");

export const CMD = {
  ZOOM_IN: 11,
  ZOOM_OUT: 12,
  FOCUS_NEAR: 13,
  FOCUS_FAR: 14,
  IRIS_OPEN: 15,
  IRIS_CLOSE: 16,
  TILT_UP: 21,
  TILT_DOWN: 22,
  PAN_LEFT: 23,
  PAN_RIGHT: 24,
  UP_LEFT: 25,
  UP_RIGHT: 26,
  DOWN_LEFT: 27,
  DOWN_RIGHT: 28,
};
