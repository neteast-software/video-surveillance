import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NTreeSelect,
  NPopselect,
  NDatePicker,
  NTimePicker,
  NCheckboxGroup,
  NRadioGroup,
  NSwitch,
  NSlider,
  NUpload,
  FormItemRule,
  NGridItem,
  NDropdown,
  NColorPicker,
  NDynamicInput,
  NAutoComplete,
} from "naive-ui";
import type { CascaderProps, TransferProps } from "naive-ui";
// import type {} from 'naive-ui'
import { Operation } from "../table/type";
import type { Props as CustomAutoCompleteProps } from "./AutoComplete.vue";
import type { Props as CustomSelectProps } from "./Select.vue";
import type { Props as CustomCascaderProps } from "./Cascader.vue";
import type {
  Props as RichTextProps,
  RichTextValue,
} from "../richtext/index.vue";
import type { Props as HeroIconProps } from "../other/HeroIcon.vue";
import { RequestMethods } from "@/utils/network/http";
type FormProps = InstanceType<typeof NForm>["$props"];
interface BaseFormConfig {
  items: FormItem[];
  labelWidth?: FormProps["labelWidth"];
  labelAlign?: FormProps["labelAlign"];
  labelPlacement?: FormProps["labelPlacement"];
}
export interface FormConfig extends BaseFormConfig {
  // mode?: 'complex' | '';
  name?: string;
  desc?: string;
  submitUrl?: string;
  submitMethod?: RequestMethods;
  buttons?: Operation[];
  inline?: boolean;

  // xGap?: GridProps['xGap'];
  // yGap?: GridProps['yGap'];
  // cols?: GridProps['cols'];
}
export interface FilterConfig extends BaseFormConfig {
  mode?: "complex" | "";
}

export type FormData = Record<string, any>;
// interface
// const re = new RegExp('d', 'd')
// interface RegExpValidator {
//     regexp: [string, string];
//     message: string;
// }
type FormItemProps = InstanceType<typeof NFormItem>["$props"];
type GridItemProps = InstanceType<typeof NGridItem>["$props"];
export interface CustomFormItemRule
  extends Omit<FormItemRule, "type" | "pattern"> {
  type?: FormItemRule["type"] | "mobile";
  pattern?: FormItemRule["pattern"] | [string] | [string, string];
  // patternFlag?: string;
}

export interface BaseFormItem extends Omit<FormItemProps, "rule"> {
  name: string;
  value?: any;
  label?: string;
  component: string;
  rules?: CustomFormItemRule | Array<CustomFormItemRule>;
  slots?: Record<string, any>;
  offset?: GridItemProps["offset"];
  span?: GridItemProps["span"];
  hidden?: boolean;
  outside?: boolean;
  attrs?: Record<string, any>;
  readonly?: boolean;
  inline?: boolean;
  // next?: (current: FormItem, acients: FormItem[]) => FormItem | BaseFormItem['name'];
  next?: (val: any) => FormItem | BaseFormItem["name"];
  parent?: FormItem;
  width?: string | number;
  height?: string | number;
  widthPercent?: string;
  heightPercent?: string;
}
type BaseSlot = string | HeroIconProps;
interface BaseFormItemSlots {
  prefixIcon?: BaseSlot;
  suffixIcon?: BaseSlot;
  prefixText?: string;
  suffixText?: string;
}

type InputProps = InstanceType<typeof NInput>["$props"];
interface InputFormItem extends BaseFormItem, BaseFormItemSlots {
  component: "input";
  value?: InputProps["value"];
  quick?: boolean;
  attrs?: InputProps;
}

// number
type NumberInputProps = InstanceType<typeof NInputNumber>["$props"];
interface NumberInputFormItem extends BaseFormItem, BaseFormItemSlots {
  component: "number";
  value?: NumberInputProps["value"];
  attrs?: NumberInputProps;
}

// select
type SelectProps = InstanceType<typeof NSelect>["$props"];
interface SelectFormItem extends BaseFormItem {
  component: "select";
  value?: SelectProps["value"];
  attrs?: SelectProps & CustomSelectProps;
  // attrs?: SelectProps;
}

// treeSelect
type TreeSelectProps = InstanceType<typeof NTreeSelect>["$props"];
interface TreeSelectFormItem extends BaseFormItem {
  component: "treeSelect";
  value?: TreeSelectProps["value"];
  attrs?: TreeSelectProps & {
    valueField?: string;
  };
}

// popSelect
type PopselectProps = InstanceType<typeof NPopselect>["$props"];
interface PopselectFormItem extends BaseFormItem {
  component: "popSelect";
  value?: PopselectProps["value"];
  attrs?: PopselectProps;
}

// iconSelect
interface IconSelectFormItem extends BaseFormItem {
  component: "iconSelect";
  value?: string;
  attrs?: InputProps;
}

// checkbox
type CheckGroupProps = InstanceType<typeof NCheckboxGroup>["$props"];
interface CheckboxOption {
  [key: string]: number | string | undefined;
}
interface CheckboxFormItem extends BaseFormItem {
  component: "checkbox";
  value?: CheckGroupProps["value"];
  // options: InstanceType<typeof NCheckbox>['$props'];
  min?: CheckGroupProps["min"];
  max?: CheckGroupProps["max"];
  attrs: CheckGroupProps & {
    options: CheckboxOption[];
    valueField?: string;
    labelField?: string;
  };
}

// radio
type RadioGroupProps = InstanceType<typeof NRadioGroup>["$props"];
// type RadioProps = InstanceType<typeof NRadio>['$props'];
interface RadioOption {
  // label: NonNullable<RadioProps['label']>;
  // value?: NonNullable<RadioProps['value']>;
  [key: string]: number | string | undefined;
}
interface RadioFormItem extends BaseFormItem {
  component: "radio";
  value?: RadioGroupProps["value"];
  attrs: RadioGroupProps & {
    options: RadioOption[];
    valueField?: string;
    labelField?: string;
  };
}

// colorPicker
type ColorPickerProps = InstanceType<typeof NColorPicker>["$props"];
interface ColorPickerFormItem extends BaseFormItem {
  component: "colorPicker";
  value?: ColorPickerProps["value"];
  attrs?: ColorPickerProps;
}
type DynamicInputProps = InstanceType<typeof NDynamicInput>["$props"];
interface DynamicInputFormItem extends BaseFormItem {
  component: "dynamicInput";
  value?: DynamicInputProps["value"];
  attrs?: DynamicInputProps;
}
// date
type DatePickerProps = InstanceType<typeof NDatePicker>["$props"];
interface DatePickerFormItem extends BaseFormItem {
  component: "date";
  value?: DatePickerProps["value"];
  attrs?: DatePickerProps;
  separator?: string;
  dateIcon?: BaseSlot;
}

// time
type TimePickerProps = InstanceType<typeof NTimePicker>["$props"];
interface TimePickerFormItem extends BaseFormItem {
  component: "time";
  value?: TimePickerProps["value"];
  attrs?: TimePickerProps;
  icon?: BaseSlot;
}

// switch
type SwitchProps = InstanceType<typeof NSwitch>["$props"];
interface SwitchFormItem extends BaseFormItem {
  component: "switch";
  value?: SwitchProps["value"];
  attrs?: SwitchProps;
  icon?: BaseSlot;
}

// slider
type SliderProps = InstanceType<typeof NSlider>["$props"];
interface SliderFormItem extends BaseFormItem {
  component: "slider";
  value?: SliderProps["value"];
  attrs?: SliderProps;
  thumb?: BaseSlot;
}

// upload
type UploadProps = InstanceType<typeof NUpload>["$props"];
export type UploadHeaders =
  | { name: string; value?: string }[]
  | Record<string, any>;
export interface UploadFormItem extends BaseFormItem {
  component: "upload";
  // fileType: 'image' | 'file';
  value?: UploadProps["fileList"];
  attrs?: UploadProps & {
    headers?: UploadHeaders;
    sizeLimit?: number | number;
    minSize?: number | number;
  };
  appendix?: { name: string; url: string }[];
  tip?: string;
}

// dropdown
type DropdownProps = InstanceType<typeof NDropdown>["$props"];
interface DropdownFormItem extends BaseFormItem {
  component: "dropdown";
  label: string;
  attrs?: DropdownProps;
}

// sort
interface SortFormItem extends BaseFormItem {
  component: "sort";
  label: string;
  value?: boolean;
}

// autoComplete
export type AutoCompleteProps = InstanceType<typeof NAutoComplete>["$props"];
interface AutoCompleteFormItem extends BaseFormItem, BaseFormItemSlots {
  component: "autoComplete";
  value?: AutoCompleteProps["value"];
  attrs?: AutoCompleteProps & CustomAutoCompleteProps;
}

// cascader
interface CascaderFormItem extends BaseFormItem {
  component: "cascader";
  value?: CascaderProps["value"];
  attrs?: CascaderProps & CustomCascaderProps;
}

// transfer
interface TransferAttrs extends TransferProps {
  valueField?: string;
  labelField?: string;
}
interface TransferFormItem extends BaseFormItem {
  component: "transfer";
  value?: TransferProps["value"];
  attrs?: TransferAttrs;
}

// richtext
interface RichTextFormItem extends BaseFormItem {
  component: "richtext";
  value?: RichTextValue;
  attrs?: Omit<RichTextProps, "value">;
}

export type PopFormPlacement = "top" | "bottom" | "left" | "right" | "center";

// line
export interface LineFormItem extends BaseFormItem {
  component: "line";
}

export type FormItem =
  | InputFormItem
  | NumberInputFormItem
  | SelectFormItem
  | TreeSelectFormItem
  | PopselectFormItem
  | CheckboxFormItem
  | RadioFormItem
  | ColorPickerFormItem
  | DynamicInputFormItem
  | DatePickerFormItem
  | TimePickerFormItem
  | SwitchFormItem
  | SliderFormItem
  | UploadFormItem
  | DropdownFormItem
  | SortFormItem
  | RichTextFormItem
  | AutoCompleteFormItem
  | CascaderFormItem
  | LineFormItem
  | IconSelectFormItem
  | TransferFormItem;
