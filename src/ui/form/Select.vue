<template>
  <NSelect
    class="min-w-[160px]"
    filterable
    clearable
    v-bind="$attrs"
    :value="
      actualValue
        ? actualValue
        : optionValues.includes(value) || isDef(value)
        ? actualValue
        : undefined
    "
    :options="options"
    :remote="remote"
    :multiple="multiple"
    :loading="loading"
    :label-field="labelField"
    :value-field="valueField"
    :render-label="renderLabel"
    @focus="onValueUpdate(actualValue)"
    @search="onValueUpdate"
    @update:value="$emit('update:value', $event ?? null)"
  >
    <template
      #[slotName]="props"
      v-for="(_, slotName) in $slots"
      :key="slotName"
    >
      <slot :name="slotName" v-bind="props"></slot>
    </template>
  </NSelect>
</template>

<script setup lang="ts">
import { NSelect, SelectProps } from "naive-ui";
import {
  SelectMixedOption,
  SelectOption,
} from "naive-ui/es/select/src/interface";
import { computed, watch } from "vue";
import type { RemoteProps } from "./remote";
import { useRemoteSearch } from "./remote";
import { VNodeChild } from "vue";
import type { FormData as FormDataType } from "./type";
import { isDef } from "@/utils/validator";

export interface Props extends RemoteProps {
  value?: SelectProps["value"];
  data?: FormDataType;
  options?: SelectMixedOption[];
  remote?: boolean;
  multiple?: boolean;
  multipleLimit?: number;
}
const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  method: "get",
  queryField: "keyword",
  labelField: "label",
  valueField: "value",
  multipleLimit: -1,
  value: null,
});

const emits = defineEmits(["update:value"]);
const actualValue = computed(() => {
  const { value, multiple, multipleLimit, valueField } = props as any;
  if (!multiple) return value;
  if (!Array.isArray(value)) return value;
  if (multipleLimit < 0 || value.length <= (multipleLimit || 0)) return value;
  const newValue = value.slice(0, multipleLimit);
  emits("update:value", newValue);
  return newValue;
});

const { remoteOptions, loading, onValueUpdate } =
  useRemoteSearch<SelectMixedOption[]>(props);
// if (props.remote) {
//     onValueUpdate(actualValue.value);
// }
const options = computed<SelectMixedOption[]>(() => {
  const { options, remote, queryField, value, labelField, valueField, data } =
    props;
  if (!remote) return options;
  if (!remoteOptions.value.length && value) {
    return [{ [labelField]: data?.[queryField], [valueField]: value }];
  }
  return remoteOptions.value;
});
const optionValues = computed(() =>
  options.value.map((option) => option[props.valueField])
);

const renderLabel = (options: SelectOption): VNodeChild => {
  const { labelField, suffixField } = props;
  return suffixField
    ? ([
        options[labelField],
        options[suffixField] ? `(${options[suffixField]})` : undefined,
      ] as VNodeChild)
    : ([options[labelField]] as VNodeChild);
};
</script>

<style scoped></style>
