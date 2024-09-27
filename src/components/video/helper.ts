import { InjectionKey, Ref } from 'vue';
export const recordTimerKey = Symbol('recordTimer') as InjectionKey<Ref<number>>;
export const isRecordKey = Symbol('isRecord') as InjectionKey<Ref<boolean>>;
export const isReadyKey = Symbol('isReady') as InjectionKey<Ref<boolean>>;
export const isPlayingKey = Symbol('isPlaying') as InjectionKey<Ref<boolean>>;
export const playSpeedKey = Symbol('playSpeed') as InjectionKey<Ref<number>>;
