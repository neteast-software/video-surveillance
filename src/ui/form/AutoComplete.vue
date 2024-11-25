<template>
  <NAutoComplete
    v-bind="$attrs"
    :options="options"
    :value="value"
    @update:value="onValueUpdate"
    :loading="loading"
  ></NAutoComplete>
</template>

<script setup lang="ts">
import { NAutoComplete } from "naive-ui";
import { AutoCompleteOptions } from "naive-ui/es/auto-complete/src/interface";
import { computed } from "vue";
import { RemoteProps, useRemoteSearch } from "./remote";
export interface Props extends RemoteProps {
  value?: string;
  options?: AutoCompleteOptions;
}
const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  method: "get",
  queryField: "name",
  labelField: "label",
  valueField: "value",
});
const { remoteOptions, loading, onValueUpdate } =
  useRemoteSearch<AutoCompleteOptions>(props);
const options = computed(() => {
  const options: AutoCompleteOptions = [
    ...props.options,
    ...remoteOptions.value,
  ];
  return options
    .map((item) => {
      if (typeof item === "string") return { label: item, value: item };
      return item;
    })
    .filter(
      (item) =>
        item.label && (item.label as string)?.includes(props.value || "")
    );
});
</script>

<style scoped></style>
