<template>
  <div class="flex items-center bg-white text-black py-3.5 px-4 rounded w-73.5">
    <div class="w-9 h-9 flex-center text-white mr-4 bg-primary rounded-full">
      {{ roleName.charAt(0) }}
    </div>
    <div class="w-0 flex-1 flex-col">
      <span class="text-lg">{{ roleName }}</span>
      <!-- <sapn class="text-info text-xs truncate"></sapn> -->
    </div>
    <NTooltip
      v-model:show="isShow"
      trigger="click"
      placement="bottom-end"
      ref="tooltipRef"
    >
      <template #trigger>
        <div
          class="w-5 h-5 flex-center rounded-lg"
          style="border: 1px solid #f2f2f2"
          @click.stop="isShow = true"
        >
          <span class="pb-2">...</span>
        </div>
      </template>
      <div class="flex items-center">
        <div
          class="i-icons:trash w-4 h-4 cursor-pointer"
          @click="$emit('delete', data.id)"
        ></div>
        <div class="w-px h-4 mx-4 bg-info"></div>
        <div
          class="i-icons:edit w-4 h-4 cursor-pointer"
          @click="editRole(data.id)"
        ></div>
      </div>
    </NTooltip>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NTooltip } from "naive-ui";
// import trashIcon from '@ebuild/icons/trash';
// import editIcon from '@ebuild/icons/edit';
import { computed, ref } from "vue";
import type { RoleListItem } from "@/utils/network/types/manager";

import { useDialogAsync } from "@/ui/dialog";
import { modifyRole } from "@/utils/network/api/baseSetting";
interface Props {
  data: any;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{
  update: [data: RoleListItem];
  delete: [roleId: number];
}>();
const { promptDialog } = useDialogAsync();
const roleName = computed<string>(() => props.data.roleName);
const isShow = ref(false);

async function editRole(id: number) {
  isShow.value = false;
  const name = await promptDialog(
    { title: "修改角色名", content: "请输入角色名" },
    roleName.value
  );
  const trimedName = name.trim();
  if (!trimedName) return window.$message?.error("修改失败，角色名称不能为空");
  if (trimedName === roleName.value) return;
  await modifyRole({ roleName: trimedName, id });
  emit("update", { ...props.data, roleName: trimedName });
  window.$message?.success("修改成功");
}
</script>

<style scoped></style>
