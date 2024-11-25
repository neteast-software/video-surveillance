<template>
  <NConfigProvider :class="wrapperClass" :locale="zhCN" :date-locale="dateZhCN">
    <NForm
      ref="formRef"
      :inline="inline"
      :label-placement="config?.labelPlacement || 'top'"
      :label-align="config?.labelAlign"
      :label-width="config?.labelWidth"
      :model="formData"
      :show-feedback="showFeedback"
      v-bind="$attrs"
    >
      <template v-if="!isDynamic">
        <template
          v-for="item in (config.items || [] as FormItemType[])"
          :key="item.name"
        >
          <template v-if="item.component === 'upload'">
            <FormItem
              ref="uploadRefs"
              :model-value="formData"
              @update:model-value="formData = $event"
              :item="item"
              @form-updated="formUpdated = true"
            ></FormItem>
          </template>
          <template v-else>
            <FormItem
              v-if="!item.hidden"
              v-model="formData"
              :item="item"
              @form-updated="formUpdated = true"
            ></FormItem>
          </template>
        </template>
      </template>
      <template v-else>
        <FormItem
          v-model="formData"
          :item="config.items[0]"
          :item-map="itemsMap"
        ></FormItem>
      </template>
      <slot></slot>
      <slot
        name="footer"
        v-if="showButton"
        :formData="formData"
        :checkForm="checkForm"
      >
        <template v-if="config.submitUrl">
          <NButton
            class="w-full"
            type="primary"
            @click="
              makeOperation(
                {
                  link: config.submitUrl,
                  method: config.submitMethod,
                  type: 'submit',
                  name: '提交',
                } as any,
                formData,
                config
              )
            "
            >提交</NButton
          >
        </template>
        <template v-if="config.buttons">
          <div class="flex justify-end">
            <NButton
              style="margin-left: 18px"
              v-for="(button, idx) in config.buttons"
              :key="idx"
              type="primary"
              @click="makeOperation(button, formData)"
              >{{ button.name }}</NButton
            >
          </div>
        </template>
      </slot>
    </NForm>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NForm, NButton, NConfigProvider } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
import { ref, computed, inject, watch } from "vue";
import FormItem from "./FormItem.vue";
import type { FormConfig, FormData, FormItem as FormItemType } from "./type";
import { FormInst } from "naive-ui";
// import { Operation } from "@ebuild/ui/table/type";
import { useDialogAsync } from "@/ui/dialog";
import { useDebounceFn } from "@vueuse/core";
import { NOOP } from "@/utils/other";
import { InternalRowData } from "naive-ui/es/data-table/src/interface";
import { omitFiledByReadonly } from "./helper";
import { useRefHistory } from "@vueuse/core";
defineOptions({
  inheritAttrs: false,
});
interface FormProps {
  wrapperClass?: string;
  inline?: boolean;
  config: FormConfig;
  modelValue: FormData;
  showButton?: boolean;
  showFeedback?: boolean;
  doOperate?: (
    // op: Operation,
    op: any,
    row?: InternalRowData | undefined,
    needRefresh?: boolean
  ) => Promise<void>;
}
const props = withDefaults(defineProps<FormProps>(), {
  showButton: true,
  showFeedback: true,
});

const emits = defineEmits([
  "submit",
  "update:modelValue",
  "afterSubmit",
  "validateError",
]);

const formRef = ref<FormInst | null>(null);
const formData = computed<FormData>({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value);
  },
});
const { history } = useRefHistory(formData);

const formUpdated = ref(false);

const { confirmDialog } = useDialogAsync();
async function checkFormUpdated() {
  if (history.value.length <= 1) return;
  await confirmDialog({
    title: "提示",
    content: "关闭可能丢失已编辑的数据，确定吗?",
  });
}

const uploadRefs = ref<InstanceType<typeof FormItem>[]>([]);

async function checkValid() {
  try {
    await formRef.value?.validate();
  } catch (error) {
    emits(
      "validateError",
      error,
      document.querySelector(".n-form-item-blank--error")
    );
    window.$message?.error("表单校验失败");
    throw error;
  }
}
async function checkUpload() {
  const uploaders = uploadRefs.value;
  const submits = uploaders.map((uploader) => uploader.submit());
  try {
    await Promise.all(submits);
  } catch (error) {
    console.log("上传是比", error);
    window.$message?.error("上传未成功，请重试");
    throw error;
  }
}
async function checkForm() {
  await checkValid();
  await checkUpload();
}

const loading = inject("loading", { showLoading: NOOP, hideLoading: NOOP });
const makeOperation = useDebounceFn(
  async (button, _formData: FormData, formConfig?: FormConfig) => {
    const { doOperate } = props;
    try {
      if (button.type === "submit") {
        await checkValid();
        loading?.showLoading();
        await checkUpload();
      }
      if (doOperate) {
        const omitedFormData = omitFiledByReadonly(formData.value, formConfig);
        await doOperate(button, omitedFormData, true);
      }
      emits("afterSubmit");
    } finally {
      loading?.hideLoading();
    }
  },
  150
);
// async function makeOperation(button: Operation, formData: FormData) {
// }
defineExpose({
  checkForm,
  makeOperation,
  checkFormUpdated,
});

const itemsMap = computed(() => {
  const items = props.config.items || [];
  return Object.fromEntries(
    items.map((item, idx) => {
      if (!item.next) item.next = () => items[idx + 1];
      return [item.name, item];
    })
  );
});
const isDynamic = computed(() => {
  const items = props.config.items || [];
  return items.some((item) => item.next);
});
</script>

<style scoped>
.none {
  @apply hidden;
}
</style>
