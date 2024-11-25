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
        <!-- :render-suffix="renderSuffix" -->
        <NTree
          :show-irrelevant-nodes="false"
          :pattern="pattern"
          :data="treeList"
          key-field="id"
          label-field="name"
          block-line
          :default-expand-all="true"
          @update:selected-keys="updateCheckedKeys"
          :default-selected-keys="defaultExpandedKeys"
        />
      </NScrollbar>
      <NButton class="mb-3 !mr-5">
        <div class="i-icons:add w-5 h-5"></div>
        添加设备
      </NButton>
    </aside>
    <div class="h-full w-1px bg-greyLine mr-5"></div>
    <Viewer
      :key="treeListId"
      class="flex-w-rest h-full"
      :uri="`/channelInfo/dynamicList?areaId=${treeListId}`"
    ></Viewer>
  </div>
</template>

<script setup lang="ts">
import { Viewer } from "linker-uii";
import { NInput, NTree, NButton, NScrollbar, NPopselect } from "naive-ui";
import { h, onMounted, ref } from "vue";
// import { treeData } from "./text";
import { getTreeList } from "@/utils/network/api/deviceManage";
import type { TreeList } from "@/utils/network/types/deviceManage";
const pattern = ref("");
const treeList = ref<TreeList[]>();
const defaultExpandedKeys = ref([1]); // 声明为数组类型
async function initData() {
  const { data } = await getTreeList();
  if (!data) return;
  treeList.value = data;
  console.log("treeData", treeList.value);
  // 设置第一个节点的 id 为默认展开的节点
  if (treeList.value.length > 0) {
    defaultExpandedKeys.value = [treeList.value[0].id];
  }
}

onMounted(initData);

// const defaultExpandedKeys = ref(["0"]);
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

const treeListId = ref(1);
// 更新选中项，确保始终有一个选中节点
function updateCheckedKeys(keys: number[]) {
  if (keys.length === 0) {
    keys.push(treeListId.value);
  } else {
    treeListId.value = keys[0];
  }
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
