<template>
	<div class="pt-8 pl-11 h-full flex flex-col">
		<span class="mb-8 text-info">{{ title }}</span>
		<section class="h-0 flex-1">
			<NScrollbar>
				<NTree
					v-show="inited"
					:data="data"
					:cascade="cascade"
					selectable
					checkable
					:key-field="keyField"
					:label-field="labelField"
					:checked-keys="checkedKeys"
					:children-field="childrenField"
					@update:checked-keys="
						(...args) => $emit('update:checkedKeys', ...args)
					"
					@update:indeterminate-keys="
						(...args) => $emit('update:indeterminateKeys', ...args)
					"
					:node-props="nodeProps"
				></NTree>
				<NDropdown
					trigger="manual"
					placement="bottom-start"
					:show="showContextMenu"
					:x="x"
					:y="y"
					:options="contextMenuOptions"
					@clickoutside="showContextMenu = false"
					@select="onContextMenuSelect"
				></NDropdown>
			</NScrollbar>
		</section>
	</div>
</template>

<script setup lang="ts">
import {
	NTree,
	type TreeOption,
	NScrollbar,
	NDropdown,
	DropdownOption,
} from "naive-ui";
import { Key, TreeNodeProps } from "naive-ui/es/tree/src/interface";
import { ref } from "vue";
interface Props {
	title: string;
	data: TreeOption[];
	checkedKeys?: Key[];
	keyField?: string;
	labelField?: string;
	childrenField?: string;
	inited?: boolean;
	cascade?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
	inited: true,
	childrenField: "children",
	keyField: "id",
	cascade: true,
	checkedKeys: () => [],
});
const emit = defineEmits(["update:checkedKeys", "update:indeterminateKeys"]);
const showContextMenu = ref(false);
const x = ref(0);
const y = ref(0);
const contextMenuOptions: DropdownOption[] = [
	{ label: "全选", key: "checkAll" },
	{ label: "取消全选", key: "uncheckAll" },
];
let childrenKeys: Key[] = [];
const nodeProps: TreeNodeProps = ({ option }) => {
	return {
		onContextmenu(e: MouseEvent): void {
			if (props.cascade) return;
			showContextMenu.value = true;
			x.value = e.clientX;
			y.value = e.clientY;
			e.preventDefault();
			const children = (option[props.childrenField] ||
				[]) as TreeOption[];
			const descendantsKeys = getDescendantsKeys(
				children,
				props.keyField,
				props.childrenField
			);
			childrenKeys = [option[props.keyField] as Key, ...descendantsKeys];
		},
	};
};
function getDescendantsKeys(
	options: TreeOption[],
	keyField: string,
	childrenField: string
) {
	let keys: Key[] = [];
	options.forEach((item) => {
		keys.push(item[keyField] as Key);
		if (item[childrenField]) {
			keys = keys.concat(
				getDescendantsKeys(
					item[childrenField] as TreeOption[],
					keyField,
					childrenField
				)
			);
		}
	});
	return keys;
}
function onContextMenuSelect(key: string) {
	let { checkedKeys } = props;
	if (key === "checkAll") {
		checkedKeys = [...new Set([...checkedKeys, ...childrenKeys])];
	} else {
		checkedKeys = checkedKeys.filter(
			(item) => !childrenKeys.includes(item)
		);
	}
	emit("update:checkedKeys", checkedKeys);
	checkedKeys = [];
	showContextMenu.value = false;
}
</script>

<style scoped></style>
