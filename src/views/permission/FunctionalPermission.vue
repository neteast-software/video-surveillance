<template>
  <NSpin class="h-full" :show="loading || !inited">
    <div class="flex flex-col h-full">
      <main class="flex h-0 flex-1">
        <PermissionTree
          class="w-0 flex-1"
          :inited="inited"
          :data="functionTree"
          :checkedKeys="functionChecked"
          :keyField="keyField"
          :labelField="labelField"
          :childrenField="childrenField"
          :cascade="cascade"
          title="功能权限"
          default-expand-all
          @update:checked-keys="functionChecked = $event"
        ></PermissionTree>
        <CheckedList
          :list="checkedDetailList"
          :keyField="keyField"
          :labelField="labelField"
          @delete="delChecked"
        ></CheckedList>
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
import { NSpin, NButton, TreeOption } from "naive-ui";
import PermissionTree from "./PermissionTree.vue";
import {
  computed,
  onMounted,
  ref,
  shallowReactive,
  shallowRef,
  unref,
  h,
  watch,
  reactive,
} from "vue";
import {
  getFunctionList,
  getRoleCheckedFunction,
  saveRoleFunction,
} from "@/utils/network/api/manager";
import { useDialogAsync } from "@/ui/dialog";
import CheckedList from "./CheckedList.vue";
interface Props {
  tabId: string;
  roleId: number;
  types: (number | string)[];
  cascade?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  cascade: true,
});
const { confirmDialog } = useDialogAsync();
const loading = ref(false);
const keyField = "id";
const labelField = "regionName";
const childrenField = "childrenList";
const inited = ref(false);

const functionTree = shallowRef<TreeOption[]>([]);
const functionMap = shallowReactive<Record<string | number, any>>({});
function mixKeyByType(
  tree?: TreeOption[],
  parentName = ""
): TreeOption[] | undefined {
  if (!tree) return undefined;
  return tree.map((option) => {
    // let id = `${option['type']}-${option['id']}` as string | number;
    let id = option["id"] as string | number;
    let suffix = () =>
      h("span", { class: "text-warning" }, { default: () => "（区域）" });
    if (option["type"] == 2) {
      id = `${option["type"]}-${option["id"]}` as string | number;
      suffix = () =>
        h("span", { class: "text-success" }, { default: () => "（设备）" });
    }
    functionMap[id] = { ...option, parentName };
    return {
      ...option,
      id: id,
      suffix,
      [childrenField]: mixKeyByType(
        option[childrenField] as TreeOption[],
        option[labelField] as string
      ),
    };
  });
}
async function initTree() {
  const { tabId } = props;
  const { data } = await getFunctionList(tabId);
  if (!data) return;
  const mixedData = mixKeyByType(data) as unknown as TreeOption[];
  functionTree.value = mixedData;
}
const functionChecked = ref<(string | number)[]>([]);
async function initChecked() {
  const { tabId, roleId } = props;
  const { data } = await getRoleCheckedFunction(roleId, tabId);
  if (!data) return;
  functionChecked.value =
    props.types[0] == 2
      ? data.functionChecked.map((item) => `2-${item}`)
      : data.functionChecked || [];
}
const actualChecked = computed(() => {
  return unref(functionChecked).filter((key) => {
    return props.types.includes(functionMap[key]?.type);
  });
});

const checkedDetailList = computed(() => {
  return unref(actualChecked)
    .map((item) => functionMap[item])
    .filter(Boolean);
});

onMounted(() => {
  initTree().finally(() => {
    inited.value = true;
  });
  initChecked();
});

function delChecked(id: number) {
  const idx = unref(functionChecked).findIndex((item) => item == id);
  if (idx < 0) return;
  functionChecked.value.splice(idx, 1);
}

// 保存权限
async function savePermission() {
  await confirmDialog({
    title: "保存权限",
    content: "确定保存权限吗？",
  });
  const { roleId, tabId } = props;
  loading.value = true;
  const checkedKeys = unref(actualChecked).map((item) =>
    typeof item == "number" ? item : parseInt(item.split("-")[1])
  );
  try {
    await saveRoleFunction(tabId, roleId, checkedKeys);
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
