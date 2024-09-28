<template>
  <div class="flex flex-col gap-3.5 pl-5 no-scrollbar flex-w-rest mr-6 h-full">
    <section class="gap-x-3.5 flex items-start justify-between h-full">
      <section ref="monitorWrap" class="flex-w-rest h-full">
        <MonitorGallery :isFullscreen="isFullscreen"></MonitorGallery>
      </section>
      <div class="bg-white px-5 py-6 rounded-4 h-full">
        <header class="flex-y-center gap-1 text-5 font-600">
          <div class="bg-primary h-16px w-4px rounded-1px"></div>
          设备信息
        </header>
        <MonitorList
          class="flex flex-7 gap-3.5 self-stretch"
          :regionId="rigionId"
          @select="onSelectMonitorCard"
        ></MonitorList>
      </div>
    </section>
    <template v-if="mounted">
      <!-- <Teleport to="#fullscreen">
        <NButton circle quaternary @click="enter">
          <i
            ><Icon :icon="enterFullScreen" class="w-6 h-6 cursor-pointer"></Icon
          ></i>
        </NButton>
      </Teleport> -->
    </template>
    <!-- <RegionSelector
          :data="regionList"
          label-field="regionName"
          :key-field="key"
          :children-field="childrenKey"
          @enterRigion="rigionId = $event"
      ></RegionSelector> -->
  </div>
</template>

<script setup lang="ts">
import MonitorGallery from "./MonitorGallery.vue";
import MonitorList from "./MonitorList.vue";
import { onMounted, ref } from "vue";
import { useElementSize, useMounted } from "@vueuse/core";
import type { MonitorRegionOption } from "../../utils/network/types/security";
import { Icon } from "@iconify/vue";
import { useFullscreen } from "@vueuse/core";
// import enterFullScreen from "../../Icons/fullscreen.svg";
import { NButton } from "naive-ui";

const mounted = useMounted();
const monitorWrap = ref<HTMLElement>();
const { height } = useElementSize(monitorWrap);
const { isFullscreen, enter, exit } = useFullscreen(monitorWrap);
const rigionId = ref(0);

const regionList = ref<MonitorRegionOption[]>([]);
const key = "id";
const childrenKey = "childrenList";
async function initOptions() {
  // const { data } = await getMonitorRegionOptions();
  // const tree = data[0]?.childrenList || [];
  // regionList.value = traverseTree(tree, childrenKey, 'regionName');
}
// function traverseTree(
//   tree: MonitorRegionOption[],
//   childrenKey = "children",
//   labelKey = "label",
//   parentName = ""
// ) {
//   return tree.map((item) => {
//     const label = item[labelKey];
//     let children = item[childrenKey];
//     if (children) {
//       children = traverseTree(children, childrenKey, labelKey, label);
//     }
//     return { ...item, parentName, [childrenKey]: children };
//   });
// }
// onMounted(initOptions);

// const monitorWrap = ref(null);
// const { width } = useElementSize(monitorWrap);

function onSelectMonitorCard(indexCode: string) {}
</script>

<style scoped></style>
