import { EventBusKey } from "@vueuse/core";

export const zoomKey: EventBusKey<[number, number]> = Symbol('zoom')
export const zoomUpdateKey: EventBusKey<number> = Symbol('zoomUpdate')