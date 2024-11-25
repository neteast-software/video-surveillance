<template>
  <NFormItem
    v-if="['dropdown', 'sort'].includes(item.component)"
    :class="{ 'form-item--inline': item.inline }"
    :style="{
      width: item.width
        ? `${item.width}px`
        : item.widthPercent
        ? `${item.widthPercent}%`
        : 'auto',
      height: item.height
        ? `${item.height}px`
        : item.heightPercent
        ? `${item.heightPercent}%`
        : 'auto',
    }"
    :show-label="item.showLabel"
    :show-feedback="item.showFeedback"
    :label="item.label"
    :rule="buildRules(item.rules)"
    :path="item.name"
    :label-placement="item.labelPlacement"
    v-bind="$attrs"
  >
    <!-- dropdown -->
    <template v-if="item.component === 'dropdown'">
      <DropDown
        trigger="click"
        show-arrow
        placement="bottom-end"
        :value="formData[item.name]"
        v-bind="item.attrs"
        :label="item.label"
        @select="
          formData = { ...formData, [item.name]: $event ?? null };
          $emit('formUpdated');
        "
      >
      </DropDown>
    </template>
    <!-- sort -->
    <template v-else-if="item.component === 'sort'">
      <Sort
        :label="item.label"
        :value="formData[item.name]"
        @update:value="
          formData = { ...formData, [item.name]: $event ?? '' };
          $emit('formUpdated');
        "
      ></Sort>
    </template>
  </NFormItem>
  <NFormItem
    v-else
    v-show="!item.hidden"
    :class="{ 'form-item--inline': item.inline }"
    :style="{
      width: item.width
        ? `${item.width}px`
        : item.widthPercent
        ? `${item.widthPercent}`
        : 'auto',
      height: item.height
        ? `${item.height}px`
        : item.heightPercent
        ? `${item.heightPercent}`
        : 'auto',
    }"
    :show-label="item.component !== 'line' && item.showLabel"
    :show-feedback="item.component !== 'line' && item.showFeedback"
    :label="item.label"
    :rule="buildRules(item.rules)"
    :path="item.name"
    :label-placement="item.labelPlacement"
    v-bind="$attrs"
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
          item.quick && (formData = { ...formData, [item.name]: $event || '' });
          $emit('formUpdated');
        "
        @change="
          !item.quick &&
            (formData = { ...formData, [item.name]: $event || '' });
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
        :precision="item.attrs?.precision"
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
        :value="formData[item.name]"
        :default-value="item.value"
        :data="formData"
        @update:value="
          formData = { ...formData, [item.name]: $event ?? null };
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
          formData = { ...formData, [item.name]: $event || null };
          $emit('formUpdated');
        "
      ></NTreeSelect>
    </template>
    <template v-else-if="item.component === 'iconSelect'">
      <IconSelect
        v-bind="item.attrs"
        :value="formData[item.name]"
        @update:value="
          formData = { ...formData, [item.name]: $event || null };
          $emit('formUpdated');
        "
      ></IconSelect>
    </template>
    <!-- checkbox -->
    <template v-else-if="item.component === 'checkbox'">
      <NCheckboxGroup
        :value="formData[item.name] || []"
        @update:value="
          formData = { ...formData, [item.name]: $event || null };
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
          formData = { ...formData, [item.name]: $event || null };
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
          formData = { ...formData, [item.name]: $event || null };
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
        class="w-full"
        clearable
        v-bind="item.attrs"
        :value="
          (formData[item.name] && formatTime(formData[item.name])) || null
        "
        @update:formatted-value="
          formData = { ...formData, [item.name]: $event || null };
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
        @update:files="formData = { ...formData, [item.name]: $event }"
      ></Upload>
    </template>
    <!-- richtext -->
    <template v-else-if="item.component === 'richtext'">
      <!-- <RichText
        v-bind="item.attrs"
        :key="item.name"
        :value="formData[item.name]"
        @update:value="updateFormData(item.name, $event)"
        @change="
          formData = { ...formData, [item.name]: $event };
          $emit('formUpdated');
        "
      ></RichText> -->
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
      <Cascader
        class="min-w-[180px]"
        clearable
        v-bind="item.attrs"
        :value="formData[item.name] || undefined"
        @update:value="
          formData = { ...formData, [item.name]: $event || null };
          $emit('formUpdated');
        "
      ></Cascader>
    </template>
    <template v-else-if="item.component === 'transfer'">
      <NTransfer
        v-bind="item.attrs"
        :value="formData[item.name]"
        :options="
          (item.attrs?.options || []).map((option) => ({
            ...option,
            label: option[item.attrs?.labelField || 'label'],
            value: option[item.attrs?.valueField || 'value'],
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
  <FormItem
    v-if="nextItem"
    v-model="formData"
    :item="nextItem"
    :item-map="itemMap"
  ></FormItem>
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
  NCascader,
  NTransfer,
} from "naive-ui";
import DropDown from "./DropDown.vue";
import Sort from "./Sort.vue";
// import RichText from "../richtext/index.vue";
import AutoComplete from "./AutoComplete.vue";
import Select from "./Select.vue";
import Cascader from "./Cascader.vue";
import Upload from "./Upload.vue";
import IconSelect from "./IconSelect.vue";
import Input from "./Input.vue";
import { computed, ref, watch } from "vue";
import { FormData as FormDataType, type FormItem } from "./type";
import { buildRules } from "./formRule";
import HeroIcon from "@/components/other/HeroIcon.vue";
import { isDef } from "@vueuse/core";
defineOptions({
  inheritAttrs: false,
});
export interface FormItemProps {
  item: FormItem;
  modelValue: FormDataType;
  itemMap?: Record<string, FormItem>;
}
const props = defineProps<FormItemProps>();
const emit = defineEmits(["update:modelValue", "formUpdated"]);
const formData = computed<FormDataType>({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

function updateFormData(name: string, value: any) {
  // formData.value = { ...formData.value, [name]: value };
  // formData.value = Object.assign({}, formData.value, { [name]: value });
  formData.value[name] = value;
}

function formatDateTime(date) {
  return Array.isArray(date)
    ? date.map((item) => new Date(item).getTime())
    : new Date(date).getTime();
}
function formatTime(timeStr) {
  return new Date(`1970-01-01 ${timeStr}`).getTime();
}

const currentValue = computed(() =>
  props.item?.name ? props.modelValue[props.item.name] : undefined
);

function getNext() {
  const { item, itemMap } = props;
  if (!item) return;
  if (!itemMap) return;
  let current: FormItem | undefined = item;
  if (!current) return;
  const acients: FormItem[] = [];
  acients.unshift(current);
  while ((current = current.parent)) {
    acients.unshift(current);
  }
  const nextItem = item?.next?.(currentValue.value);
  return typeof nextItem === "string" ? itemMap[nextItem] : nextItem;
}
const nextItem = computed(() => getNext());

const uploadRef = ref<InstanceType<typeof Upload>>();
defineExpose({
  submit: async () => {
    if (!uploadRef.value) return Promise.resolve(void 0);
    await uploadRef.value.submit();
  },
});
</script>

<style scoped>
.form-item--inline {
  display: inline-grid;
  margin-right: 18px;
}
</style>
