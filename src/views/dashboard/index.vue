<template>
  <div
    class="w-full h-full mx-5 rounded-4 bg-#94BFFF p-7.5 relative overflow-hidden flex justify-between"
  >
    <aside>
      <leftAaside></leftAaside>
    </aside>
    <aside>
      <NPopselect v-model:value="value" :options="options" trigger="click">
        <div class="flex-center bg-white py-2.5 px-4 rounded-1 gap-8 text-4">
          {{ value }}
          <div class="bg-#EAEFFD w-7 h-7 rounded-1 flex-center">
            <div class="i-icons:arrow w-5 h-5 text-primary"></div>
          </div>
        </div>
      </NPopselect>
    </aside>
    <!-- <CesiumTianditu
      class="absolute top-0 left-0 w-full h-full"
    ></CesiumTianditu> -->
    <!-- <CesiumViewer class="absolute top-0 left-0 w-full h-full"></CesiumViewer> -->
  </div>
</template>

<script setup lang="ts">
import LeftAaside from "@/views/dashboard/leftAside.vue";
import CesiumTianditu from "@/components/map/CesiumTianditu.vue";
import CesiumViewer from "@/components/map/CesiumViewer.vue";
import { NPopselect } from "naive-ui";
import { h, ref } from "vue";
const value = ref("设备类型");
const options = [
  { label: "全部", value: "全部" },
  { label: "在线设备", value: "在线设备" },
];
// const renderLabel: SelectRenderLabel = (option) => {
//   return h(
//     "div",
//     {
//       style: {
//         display: "flex",
//         alignItems: "center",
//       },
//     },
//     [
//       h(NAvatar, {
//         src: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
//         round: true,
//         size: "small",
//       }),
//       h(
//         "div",
//         {
//           style: {
//             marginLeft: "12px",
//             padding: "4px 0",
//           },
//         },
//         [
//           h("div", null, [option.label as string]),
//           h(
//             NText,
//             { depth: 3, tag: "div" },
//             {
//               default: () => "description",
//             }
//           ),
//         ]
//       ),
//     ]
//   );
// };
</script>

<style scoped></style>
