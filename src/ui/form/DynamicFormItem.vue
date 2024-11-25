<template>
  <template v-if="item">
    <NFormItem
      v-show="!item.hidden"
      :show-label="item.component !== 'line' && item.showLabel"
      :show-feedback="item.component !== 'line' && item.showFeedback"
      :label="item.label"
      :rule="buildRules(item.rules)"
      :path="item.name"
      :label-placement="item.labelPlacement"
    >
      <!-- input -->
      <template v-if="item.component === 'input'">
        <div v-if="item.readonly">{{ formData[item.name] || "" }}</div>
        <Input
          v-else
          placeholder=""
          clearable
          v-bind="item.attrs"
          :prefix-icon="item.prefixIcon"
          :prefix-text="item.prefixText"
          :suffix-icon="item.suffixIcon"
          :suffix-text="item.suffixText"
          :quick="item.quick"
          :value="item.quick ? (formData[item.name] || '' as string) : undefined"
          :default-value="formData[item.name] || ''"
          @update:value="
            item.quick && onUpdateValue(formData, item.name, $event);
            $emit('formUpdated');
          "
          @change="
            !item.quick && onUpdateValue(formData, item.name, $event);
            $emit('formUpdated');
          "
        >
        </Input>
      </template>
      <!-- input-number -->
      <template v-else-if="item.component === 'number'">
        <NInputNumber
          v-bind="item.attrs"
          :value="Number(formData[item.name]) || undefined"
          :precision="Number(item.attrs?.precision || 0)"
          @update:value="
            formData = { ...formData, [item.name]: $event };
            $emit('formUpdated');
          "
        ></NInputNumber>
      </template>
      <!-- select -->
      <template v-else-if="item.component === 'select'">
        <Select
          v-bind="item.attrs"
          :value="isDef(formData[item.name]) ? formData[item.name] : null"
          :data="formData"
          @update:value="
            formData = { ...formData, [item.name]: $event ?? '' };
            $emit('formUpdated');
          "
        ></Select>
      </template>
      <!-- treeSelect -->
      <template v-else-if="item.component === 'treeSelect'">
        <NTreeSelect
          v-bind="item.attrs"
          :value="isDef(formData[item.name]) ? formData[item.name] : null"
          :key-field="item.attrs?.valueField"
          @update:value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
        ></NTreeSelect>
      </template>
      <template v-else-if="item.component === 'iconSelect'">
        <IconSelect
          v-bind="item.attrs"
          :value="formData[item.name]"
          @update:value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
        ></IconSelect>
      </template>
      <!-- checkbox -->
      <template v-else-if="item.component === 'checkbox'">
        <NCheckboxGroup
          :value="formData[item.name] || []"
          @update:value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
        >
          <NSpace item-style="display: flex;">
            <NCheckbox
              v-for="option in item.attrs.options || []"
              :key="option[item.attrs.valueField || 'value']"
              :label="(option[item.attrs.labelField || 'label'] as string)"
              :value="option[item.attrs.valueField || 'value']"
              v-bind="option"
            ></NCheckbox>
          </NSpace>
        </NCheckboxGroup>
      </template>
      <!-- radio -->
      <template v-else-if="item.component === 'radio'">
        <NRadioGroup
          :value="formData[item.name] || []"
          @update:value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
          :name="item.name"
        >
          <NSpace>
            <NRadio
              v-for="option in item.attrs.options || []"
              :key="option[item.attrs.valueField || 'value']"
              :value="option[item.attrs.valueField || 'value']"
            >
              {{ option[item.attrs.labelField || "label"] }}
            </NRadio>
          </NSpace>
        </NRadioGroup>
      </template>
      <!-- Dynamic Input -->
      <template v-else-if="item.component === 'dynamicInput'">
        <NDynamicInput
          v-bind="item.attrs"
          :value="formData[item.name] || ''"
          @update:value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
        ></NDynamicInput>
      </template>
      <!-- color picker -->
      <template v-else-if="item.component === 'colorPicker'">
        <NColorPicker
          v-bind="item.attrs"
          :value="formData[item.name] || null"
          @update:value="
            formData = { ...formData, [item.name]: $event };
            $emit('formUpdated');
          "
        ></NColorPicker>
      </template>
      <!-- date picker -->
      <template v-else-if="item.component === 'date'">
        <NDatePicker
          class="w-full"
          clearable
          update-value-on-close
          v-bind="item.attrs"
          :value="
            (formData[item.name] && formatDateTime(formData[item.name])) || null
          "
          @update:formatted-value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
        >
          <template v-if="item.separator" #separator>
            <span>{{ item.separator }}</span>
          </template>
          <template v-if="item.dateIcon" #date-icon>
            <HeroIcon
              v-if="typeof item.dateIcon === 'string'"
              :icon="item.dateIcon"
            ></HeroIcon>
            <HeroIcon v-else v-bind="item.dateIcon"></HeroIcon>
          </template>
        </NDatePicker>
      </template>
      <!-- time picker -->
      <template v-else-if="item.component === 'time'">
        <NTimePicker
          clearable
          v-bind="item.attrs"
          :value="
            (formData[item.name] && new Date(formData[item.name]).getTime()) ||
            null
          "
          @update:formatted-value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
        >
          <template v-if="item.icon" #icon>
            <HeroIcon
              v-if="typeof item.icon === 'string'"
              :icon="item.icon"
            ></HeroIcon>
            <HeroIcon v-else v-bind="item.icon"></HeroIcon>
          </template>
        </NTimePicker>
      </template>
      <!-- switch -->
      <template v-else-if="item.component === 'switch'">
        <NSwitch
          v-bind="item.attrs"
          :value="
            formData[item.name] ||
            (formData[item.name] = item.attrs?.uncheckedValue || false)
          "
          @update:value="
            formData = { ...formData, [item.name]: $event };
            $emit('formUpdated');
          "
        >
          <template v-if="item.icon" #icon>
            <HeroIcon
              v-if="typeof item.icon === 'string'"
              :icon="item.icon"
            ></HeroIcon>
            <HeroIcon v-else v-bind="item.icon"></HeroIcon>
          </template>
        </NSwitch>
      </template>
      <!-- slider -->
      <template v-else-if="item.component === 'slider'">
        <NSlider
          v-bind="item.attrs"
          :value="formData[item.name] || 0"
          @update:value="
            formData = { ...formData, [item.name]: $event };
            $emit('formUpdated');
          "
        >
          <template v-if="item.thumb" #thumb>
            <HeroIcon
              v-if="typeof item.thumb === 'string'"
              :icon="item.thumb"
            ></HeroIcon>
            <HeroIcon v-else v-bind="item.thumb"></HeroIcon>
          </template>
          <template v-else #thumb>
            <div class="w-6 h-6 rounded-full bg-base flex-center shadow-lg">
              <div class="w-2.5 h-2.5 rounded-full bg-primary"></div>
            </div>
          </template>
        </NSlider>
      </template>
      <!-- upload -->
      <template v-else-if="item.component === 'upload'">
        <Upload
          ref="uploadRef"
          :item="item"
          :form-data="formData"
          :default-file-list="formData[item.name] || []"
          @update:file-list="$emit('formUpdated')"
        ></Upload>
      </template>
      <!-- richtext -->
      <template v-else-if="item.component === 'richtext'">
        <RichText
          v-bind="item"
          :value="formData[item.name]"
          @update:value="
            formData = { ...formData, [item.name]: $event };
            $emit('formUpdated');
          "
        ></RichText>
      </template>
      <!-- autoComplete -->
      <template v-else-if="item.component === 'autoComplete'">
        <AutoComplete
          v-bind="item.attrs"
          :value="formData[item.name] || ''"
          @update:value="
            formData = { ...formData, [item.name]: $event };
            $emit('formUpdated');
          "
        >
          <template #prefix>
            <template v-if="item.prefixIcon">
              <HeroIcon
                v-if="typeof item.prefixIcon === 'string'"
                :icon="item.prefixIcon"
              ></HeroIcon>
              <HeroIcon v-else v-bind="item.prefixIcon"></HeroIcon>
            </template>
            <template v-else-if="item.prefixText">
              <span>{{ item.prefixText }}</span>
            </template>
          </template>
          <template #suffix>
            <template v-if="item.suffixIcon">
              <HeroIcon
                v-if="typeof item.suffixIcon === 'string'"
                :icon="item.suffixIcon"
              ></HeroIcon>
              <HeroIcon v-else v-bind="item.suffixIcon"></HeroIcon>
            </template>
            <template v-else-if="item.suffixText">
              <span>{{ item.suffixText }}</span>
            </template>
          </template>
        </AutoComplete>
      </template>
      <template v-else-if="item.component === 'cascader'">
        <NCascader
          class="min-w-[180px]"
          clearable
          v-bind="item.attrs"
          :value="formData[item.name] || undefined"
          @update:value="
            formData = { ...formData, [item.name]: $event || '' };
            $emit('formUpdated');
          "
        ></NCascader>
      </template>
      <template v-else-if="item.component === 'transfer'">
        <NTransfer
          v-bind="item.attrs"
          :value="formData[item.name]"
          :options="
                    (item.attrs?.options || []).map((option) => ({
                        ...option,
                        label: option[item!.attrs?.labelField || 'label'],
                        value: option[item!.attrs?.valueField || 'value']
                    }))
                "
          @update:value="
            formData = { ...formData, [item.name]: $event };
            $emit('formUpdated');
          "
        ></NTransfer>
      </template>
      <!-- line -->
      <template v-else-if="item.component === 'line'">
        <h2 class="text-info text-xs h-8 pt-2.5 pb-8">{{ item.label }}</h2>
      </template>
    </NFormItem>
    <DynamicFormItem
      v-model="formData"
      :item="nextItem"
      :item-map="itemMap"
    ></DynamicFormItem>
  </template>
</template>

<script setup lang="ts">
import {
  NFormItem,
  NInputNumber,
  NTreeSelect,
  NDatePicker,
  NTimePicker,
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NSwitch,
  NSlider,
  NColorPicker,
  NDynamicInput,
  NSpace,
} from "naive-ui";
import RichText from "../richtext/index.vue";
import AutoComplete from "./AutoComplete.vue";
import Select from "./Select.vue";
import Upload from "./Upload.vue";
import IconSelect from "./IconSelect.vue";
import { computed, ref } from "vue";
import { FormData as FormDataType, FormItem } from "./type";
import { buildRules } from "./formRule";
import HeroIcon from "@/components/other/HeroIcon.vue";
import { isDef } from "@vueuse/core";
import Input from "./Input.vue";
import { set } from "lodash-es";
export interface FormItemProps {
  item?: FormItem;
  modelValue: FormDataType;
  itemMap: Record<string, FormItem>;
}

const props = defineProps<FormItemProps>();
const emit = defineEmits(["update:modelValue", "formUpdated"]);
const formData = computed<FormDataType>({
  get: () => {
    return props.modelValue;
  },
  set: (value) => emit("update:modelValue", value),
});
function onUpdateValue(
  oldformData: Record<string, any> | undefined,
  field: string,
  value: any,
  ...args
) {
  formData.value = set({ ...oldformData }, field, value || "");
  //   emit("update:modelV", value, ...args);
}

const currentValue = computed(() =>
  props.item?.name ? props.modelValue[props.item.name] : undefined
);

function getNext() {
  const { item, itemMap } = props;
  let current: FormItem | undefined = item;
  if (!current) return undefined;
  const acients: FormItem[] = [];
  acients.unshift(current);
  while ((current = current.parent)) {
    acients.unshift(current);
  }
  const nextItem = item?.next?.(currentValue.value);
  return typeof nextItem === "string" ? itemMap[nextItem] : nextItem;
}
const nextItem = computed(() => getNext());

function formatDateTime(date) {
  return Array.isArray(date)
    ? date.map((item) => new Date(item).getTime())
    : new Date(date).getTime();
}
const uploadRef = ref<InstanceType<typeof Upload>>();
defineExpose({
  submit: async () => {
    if (!uploadRef.value) return Promise.resolve(void 0);
    await uploadRef.value.submit();
  },
});
</script>

<style scoped></style>
