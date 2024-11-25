<template>
  <div class="text-info mt-4 mb-6.5 min-h-[88px]">
    <slot></slot>
    <Form
      v-if="formConfig && formConfig.items?.length"
      ref="formRef"
      class="mt-4"
      :config="formConfig"
      :model-value="formData"
      @update:model-value="$emit('update:formData', $event)"
      :show-submit="false"
      :show-button="false"
    ></Form>
  </div>
</template>

<script setup lang="ts">
import { FormConfig } from "@/ui/form/type";
// import FormItem from '../form/FormItem.vue';
import Form from "@/ui/form/Form.vue";
import { ref, watch } from "vue";

interface Props {
  formConfig?: FormConfig;
  formData: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {});
defineEmits<{
  "update:formData": [value: Record<string, any>];
}>();
const formRef = ref<InstanceType<typeof Form>>();
defineExpose({ formRef });
</script>

<style scoped></style>
