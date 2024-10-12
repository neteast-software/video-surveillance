<template>
  <div class="fill-parent flex">
    <aside class="py-5 flex-col">
      <NInput
        style="width: 100%; background: transparent"
        placeholder="请输入路段名称"
        v-model:value="pattern"
        class="mb-5 mr-5 !w-auto"
      >
        <template #prefix>
          <div class="i-icons:search w-5 h-5"></div>
        </template>
      </NInput>
      <NScrollbar class="flex-h-rest min-w-63 pr-5 lt-laptop-(pr-2)">
        <NTree
          :show-irrelevant-nodes="false"
          :pattern="pattern"
          :data="treeData"
          block-line
          :render-prefix="renderPrefix"
          :render-suffix="renderSuffix"
          @update:selected-keys="updateCheckedKeys"
          :default-expanded-keys="defaultExpandedKeys"
        />
      </NScrollbar>
      <!-- :render-switcher-icon="renderSwitcherIcon"  -->
      <NButton class="mb-3 mr-5">
        <div class="i-icons:add w-5 h-5"></div>
        添加设备
      </NButton>
    </aside>
    <div class="h-full w-1px bg-greyLine mr-5"></div>
    <Viewer class="flex-w-rest h-full" uri="/linker/viewer"></Viewer>
  </div>
</template>

<script setup lang="ts">
import { Viewer } from "linker-uii";
import { NInput, NTree, NButton, NScrollbar, NPopselect } from "naive-ui";
import { h, ref } from "vue";
import { treeData } from "./text";
const pattern = ref("");
const defaultCheckedKeys = ref(["2-1-0"]);
const defaultExpandedKeys = ref(["1", "1-0", "1-0-0"]);
function renderPrefix() {
  return h("div", { class: "i-icons:architecture w-5 h-5" }, {});
}
function renderSuffix() {
  return h(
    NPopselect,
    {
      options: [
        { label: "查看", value: "view" },
        { label: "编辑", value: "edit" },
        { label: "删除", value: "delete" },
      ],
      trigger: "click",
      showArrow: true,
    },
    {
      default: () =>
        h("div", {
          class: "i-icons:details w-5 h-5",
          onClick: (e: MouseEvent) => {
            e.stopPropagation(); // 阻止事件冒泡
          },
        }),
    }
  );
}
function updateCheckedKeys(keys: string[]) {
  console.log("11111111", keys);
}
</script>

<style scoped>
:deep(.n-tree-node) {
  padding: 12px 0;
  border-radius: 4px;
}
:deep(.n-tree .n-tree-node--selected .n-base-icon),
:deep(
    .n-tree.n-tree--block-line
      .n-tree-node:not(.n-tree-node--disabled).n-tree-node--selected
      .n-tree-node-content
  ) {
  color: #3563ef;
}
</style>
