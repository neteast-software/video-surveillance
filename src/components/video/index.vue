<template>
    <div
        class="w-max relative before:absolute-full before:bg-transparent hover:before:bg-black/30 before:z-50 group transition-colors"
        :class="classAttrs"
        @click="showPreview"
    >
        <VideoPlayer v-bind="{ ...otherAttrs, ...props }" :src="src"></VideoPlayer>
        <div
            class="absolute-center z-50 border border-white rounded-full p-1 flex-center opacity-0 transition-opacity group-hover:opacity-100"
        >
            <Icon icon="heroicons:play-solid" class="text-white" :class="buttonClass" :width="buttonSize || 24"></Icon>
        </div>
    </div>
    <NModal v-model:show="isShow">
        <VideoPlayer
            class="vjs-big-play-centered"
            v-bind="{ ...otherAttrs, ...props }"
            :width="680"
            controls
            autoplay
            :src="src"
        ></VideoPlayer>
    </NModal>
</template>

<script setup lang="ts">
import { VideoPlayer, type VideoPlayerProps } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import { NModal } from 'naive-ui';
import { ref, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';
export interface Props {
    src?: VideoPlayerProps['src'];
    preview?: boolean;
    buttonClass?: string;
    buttonSize?: number;
}
const props = withDefaults(defineProps<Props>(), {
    preview: true
});
defineOptions({
    inheritAttrs: false
});
const attrs = useAttrs();
const { class: classAttrs, ...otherAttrs } = attrs;
const isShow = ref(false);
function showPreview() {
    if (!props.preview) return;
    isShow.value = true;
}
</script>

<style scoped></style>
