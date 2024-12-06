<template>
  <NSpin class="h-full" :show="loading || !inited">
    <div class="flex flex-col h-full">
      <main class="h-0 flex-1">
        <PermissionTree
          v-if="inited"
          :data="subSystemTree"
          keyField="id"
          title="子系统权限"
          :checkedKeys="menuChecked"
          @update:checkedKeys="menuChecked = $event"
          @update:indeterminateKeys="menuIndeterminate = $event"
        ></PermissionTree>
      </main>
      <footer class="border-t border-linegrey pt-6 pr-20 flex justify-end">
        <NButton type="primary" size="small" @click="savePermission"
          >保存</NButton
        >
      </footer>
    </div>
  </NSpin>
</template>

<script setup lang="ts">
import PermissionTree from "./PermissionTree.vue";
import { NButton, NSpin } from "naive-ui";
import {
  getDeviceTree,
  getSelectedRoleDevice,
  saveDeviceRole,
} from "@/utils/network/api/baseSetting";

import { onMounted, shallowRef, ref } from "vue";
import { type TreeOption } from "naive-ui";
import { useDialogAsync } from "@/ui/dialog";
interface Props {
  roleId: number;
}
const props = withDefaults(defineProps<Props>(), {});
const loading = ref(false);
const { confirmDialog } = useDialogAsync();
const menuChecked = shallowRef<number[]>([]);
const menuIndeterminate = shallowRef<number[]>([]);
//子系统权限树
const subSystemTree = shallowRef<TreeOption[]>([]);
async function initSubsystemTree() {
  const { data } = await getDeviceTree();
  if (!data) return;
  recursionSetLabel(data);
  subSystemTree.value = data as unknown as TreeOption[];
}

// 获取角色权限详情
async function initRoleDetail() {
  const { roleId } = props;
  if (!roleId) return;
  const { data } = await getSelectedRoleDevice(roleId);

  if (!data) return;
  menuChecked.value = data;
}
function recursionSetLabel(data) {
  if (data instanceof Object) {
    data.forEach((item: any) => {
      item.label = item.name;
      if (item.children) {
        recursionSetLabel(item.children);
      }
    });
  }
}
const inited = ref(false);
onMounted(() => {
  initSubsystemTree().finally(() => {
    inited.value = true;
  });
  initRoleDetail();
});

// // 保存权限
async function savePermission() {
  await confirmDialog({
    title: "保存权限",
    content: "确定保存权限吗？",
  });
  const { roleId } = props;
  loading.value = true;
  try {
    const checkMenu = [
      ...new Set([...menuChecked.value, ...menuIndeterminate.value]),
    ];
    console.log("checkMenu", checkMenu);

    await saveDeviceRole({ id: roleId, menuIds: checkMenu });
    window.$message?.success("保存成功");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
:deep(.n-spin-content) {
  height: 100%;
}
</style>
