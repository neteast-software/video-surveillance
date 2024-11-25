<template>
  <Form v-model="formData" :config="formConfig"></Form>
</template>

<script setup lang="ts">
import Form from "./Form.vue";
import { ref, onMounted, shallowRef } from "vue";
import { FormConfig } from "./type";
import http from "@/utils/network/http";

import { useRoute } from "vue-router";
import { FormResult } from "@/utils/network/types";
import { useTimeoutPoll } from "@vueuse/core";
import { pollInterval } from "@ebuild/presets";
const route = useRoute();
const uri = (route.query.uri || route.meta.uri) as string;
const params = route.query.params || {};
const initData = async () => {
  const { data } = await http.get<FormResult>(uri, params);
  const { data: res } = data.value!;
  formData.value = res.data;
  formConfig.value = res.graph;
};
const formData = ref<Record<string, any>>({});
const formConfig = shallowRef<FormConfig>({
  items: [],
});
const { resume } = useTimeoutPoll(initData, pollInterval.rank4);
onMounted(resume);
// const buttons = ref<ButtonOperation[]>([]);
// interface FormGraph {
//     graph_type: 'form';
//     inner: boolean;
//     items: FormItem[];
//     data: Record<string, any>;
//     name: string;
//     placement: 'left' | 'right' | 'center';
//     buttons: ButtonOperation[];
// }
// onMounted(async () => {
//     const { data } = await http.get(uri);
//     const graph = data.value.data as FormGraph;
//     formConfig.items = graph.items.map((item) => {
//         item.value = graph.data[item.name];
//         return item;
//     });
//     buttons.value = graph.buttons;
// });
// function replaceLink(link: string, row: Record<string, any>) {
//     return link.replace(/:(\w+)/g, (_, p1) => {
//         return row[p1];
//     });
// }
// async function onClick(
//     button: ButtonOperation,
//     payload: Record<string, any>,
//     checkForm: (formData: FormData) => Promise<void>
// ) {
//     await checkForm(payload);
//     const { link, method } = button;
//     const url = replaceLink(link, unref(payload));
//     http.fetch(url, method, payload);
// }
</script>

<style scoped></style>
