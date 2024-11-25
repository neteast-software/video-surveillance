<template>
  <NDropdown
    class="custom-dropdown"
    v-bind="$attrs"
    trigger="click"
    :value="
      value
        ? value
        : optionValues.includes(value) || isDef(value)
        ? value
        : undefined
    "
    :key-field="valueField"
    :label-field="labelField"
    :children-field="childrenField"
    :options="options"
    @select="(_, { [props.labelField]:label, [props.valueField]: value }) => (selectLabel = (value && label) as string)"
    @update:show="isShow = $event"
  >
    <slot name="trigger">
      <div class="flex items-center cursor-pointer text-basic">
        {{ selectLabel || label }}
        <Icon :icon="ArrowIcon" :rotate="isShow ? -45 : 45" class="w-5 h-5" />
      </div>
    </slot>
  </NDropdown>
</template>

<script setup lang="ts">
import { NDropdown } from "naive-ui";
import type { DropdownProps } from "naive-ui";
import { Icon } from "@iconify/vue";
// import ArrowIcon from '@ebuild/icons/arrow';
import { computed, ref, watch } from "vue";
import { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface";
import { isDef } from "@/utils/validator";

interface Props {
  value: DropdownProps["value"];
  label: string;
  options: DropdownProps["options"];
  labelField?: string;
  valueField?: string;
  childrenField?: string;
}
const props = withDefaults(defineProps<Props>(), {
  label: "",
  options: () => [],
  labelField: "label",
  valueField: "value",
  childrenField: "children",
});
watch(
  () => props.value,
  (val) => {
    selectLabel.value = findLabelByValue(val, options.value);
  }
);
const isShow = ref(false);
// option里面递归查找value对应的label
function findLabelByValue(
  value: string | number,
  options: DropdownMixedOption[]
): string {
  const { valueField, labelField, childrenField } = props;
  for (const option of options) {
    if (option[valueField] === value) return option[labelField] as string;
    if (option[childrenField]) {
      const label = findLabelByValue(
        value,
        option[childrenField] as DropdownMixedOption[]
      );
      if (label) return label;
    }
  }
  return "";
}
const selectLabel = ref("");
function clearOptions(options: DropdownMixedOption[]) {
  const { labelField, valueField, childrenField } = props;
  return options.map((item) => {
    if (typeof item !== "object") return { item };
    return {
      [labelField]: item[labelField],
      [valueField]: item[valueField],
      [childrenField]: item[childrenField]
        ? clearOptions(item[childrenField] as DropdownMixedOption[])
        : undefined,
    };
  });
}
const options = computed(() => {
  const { labelField, valueField } = props;
  return clearOptions([
    { [labelField]: "全部", [valueField]: "" },
    ...props.options,
  ]);
});
const optionValues = computed(() =>
  options.value.map((option) => option[props.valueField])
);
</script>

<style>
.custom-dropdown .n-dropdown-menu-wrapper {
  /* max-height: 600px !important; */
  /* overflow-x: visible; */
}
.custom-dropdown .n-dropdown-menu-wrapper::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-dropdown .n-dropdown-menu-wrapper::-webkit-scrollbar-track {
  background-color: #e7eaf4;
}
.custom-dropdown .n-dropdown-menu-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 999px;
}
.custom-dropdown .n-dropdown-menu-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #015c5f #e7eaf4;
}
</style>
