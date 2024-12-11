<template>
	<aside class="bg-#F2F2F2 px-4 py-6 rounded flex flex-col dark:bg-[#2B2D30]">
		<header class="flex justify-between mb-4">
			<span>全部角色</span>
			<div
				class="flex items-center text-primary cursor-pointer"
				@click="createRole"
			>
				<div class="i-icons:cross w-3 h-3 mr-1"></div>
				创建角色
			</div>
		</header>
		<main
			class="h-0 flex-1 bg-white px-2 py-5 rounded flex flex-col items-center"
		>
			<NInput
				class="mb-4"
				size="small"
				placeholder=""
				v-model:value="searchRole"
			>
				<template #suffix>
					<div class="i-icons:magnifier w-5 h-5 cursor-pointer"></div>
				</template>
			</NInput>
			<ul class="h-0 p-0 flex-1 min-w-[294px]">
				<NScrollbar>
					<RoleItem
						class="cursor-pointer"
						v-for="role in filteredRoleList"
						:key="role.id"
						:data="role"
						@update="updateRole"
						@delete="handleDeleteRole(role.id)"
						:class="{ active: role.id === activeid }"
						@click="toogleActiveRole(role.id)"
					></RoleItem>
				</NScrollbar>
			</ul>
		</main>
	</aside>
</template>

<script setup lang="ts">
import { NButton, NInput, NScrollbar } from "naive-ui";

// import crossIcon from "@ebuild/icons/cross";
// import magnifierIcon from "@ebuild/icons/magnifier";
import RoleItem from "@/views/permission/RoleItem.vue";

import {
	getRoleList,
	addRole,
	deleteRole,
} from "@/utils/network/api/baseSetting";
import type { RoleListItem } from "@/utils/network/types/manager";
import { computed, onMounted, ref } from "vue";
import { useDialogAsync } from "@/ui/dialog";

const emits = defineEmits(["change"]);
const { confirmDialog, promptDialog } = useDialogAsync();
const roleList = ref<RoleListItem[]>([]);
const searchRole = ref("");
async function initRoleList() {
	const { data } = await getRoleList();
	if (!data) return;
	roleList.value = data;
	activeid.value = data[0].id;
	emits("change", data[0].id);
}
onMounted(initRoleList);
//搜索角色
const filteredRoleList = computed(() => {
	if (!searchRole.value) return roleList.value;
	return roleList.value.filter((role) =>
		role.roleName.includes(searchRole.value)
	);
});

async function createRole() {
	const roleName = await promptDialog({
		title: "创建角色",
		content: "请输入角色名称",
	});
	await addRole(roleName);
	await initRoleList();
	window.$message?.success("角色创建成功");
}

//删除角色
const handleDeleteRole = async (id: number) => {
	await confirmDialog({
		title: "删除角色",
		content: "确定删除该角色吗？",
	});
	await deleteRole(id);
	await initRoleList();
	window.$message?.success("角色删除成功");
};

function updateRole(role: RoleListItem) {
	const idx = roleList.value.findIndex((item) => item.id === role.id);
	if (idx === -1) return;
	roleList.value.splice(idx, 1, role);
}

const activeid = ref(0);
function toogleActiveRole(id: number) {
	if (activeid.value === id) return;
	activeid.value = id;
	emits("change", id); //发出所选角色的ID
}
</script>

<style scoped>
.active {
	background: #dfebff;
}
</style>
