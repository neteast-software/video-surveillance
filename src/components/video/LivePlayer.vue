<template>
	<VideoPlayer
		class="w-full h-full vjs-big-play-centered"
		ref="player"
		autoplay
		:sources="sources"
		controls
	></VideoPlayer>
</template>

<script setup lang="ts">
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import { ref } from "vue";
type VideoPlayerInst = InstanceType<typeof VideoPlayer>;
interface Props {
	sources?: VideoPlayerInst["$props"]["sources"];
}
withDefaults(defineProps<Props>(), {});
const player = ref<VideoPlayerInst>();
</script>

<style scoped></style>
