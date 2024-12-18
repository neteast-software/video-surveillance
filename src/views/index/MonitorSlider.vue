<template>
	<div class="flex items-center bg-base rounded px-3 pt-5.5 pb-2.5">
		<button class="w-8 h-8 mr-8" @click="scrollByStep(false)">
			<Icon :icon="ArrowIcon" width="32" :h-flip="true"></Icon>
		</button>
		<section class="w-0 flex-1">
			<NScrollbar ref="scrollbar" x-scrollable>
				<section class="flex gap-x-8">
					<div
						class="flex flex-col items-center shrink-0"
						v-for="item in 24"
						:key="item"
					>
						<img
							class="w-26 h-19.5 rounded mb-3"
							:src="testImg"
							alt="test"
						/>
						<span class="text-xs">12-1</span>
					</div>
				</section>
			</NScrollbar>
		</section>
		<button class="w-8 h-8 ml-8" @click="scrollByStep(true)">
			<Icon :icon="ArrowIcon" width="32"></Icon>
		</button>
	</div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import ArrowIcon from "@/assets/icons/arrow";
import { NScrollbar, ScrollbarInst } from "naive-ui";
import { ref } from "vue";
const testImg = new URL("@/assets/test.png", import.meta.url).href;
const scrollbar = ref<ScrollbarInst>();
const scrollStep = 100;
let leftX = 0;
function scrollByStep(positive = true) {
	leftX += positive ? scrollStep : -scrollStep;
	if (leftX < 0) leftX = 0;
	scrollbar.value?.scrollTo({ left: leftX, behavior: "smooth" });
}
</script>

<style scoped></style>
