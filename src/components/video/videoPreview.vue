<template>
    <LazyTeleport :show="show">
        <div class="video-preview-container">
            <div class="video-preview-overlay"></div>
            <div class="video-preview-toolbar"></div>
            <div class="video-preview-wrapper">
                <VideoPlayer class="video-preview" :src="src"></VideoPlayer>
            </div>
        </div>
    </LazyTeleport>
</template>

<script setup lang="ts">
import { VideoPlayer, VideoPlayerProps } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';
import { LazyTeleport } from 'vueuc';
interface Props {
    show: boolean;
    src: string;
}
withDefaults(defineProps<Props>(), {
    show: false
});
</script>

<style scoped>
.video-preview-container {
    @apply fixed left-0 right-0 top-0 bottom-0 flex z-50;
}
.video-preview-overlay {
    @apply -z-1 absolute left-0 right-0 top-0 bottom-0 bg-black/30;
}
.video-preview-toolbar {
    @apply z-1 absolute left-1/2 h-12 bottom-10 px-3 flex items-center;
}
.video-preview-wrapper {
    @apply absolute left-0 right-0 top-0 bottom-0 flex pointer-events-none;
}
.video-preview {
    @apply m-auto;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
}
</style>
