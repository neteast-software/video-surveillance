import http, { RequestMethods } from "@/utils/network/http";
import { useDebounceFn } from "@vueuse/core";
import { AutoCompleteOptions } from "naive-ui/es/auto-complete/src/interface";
import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { Ref, ref } from "vue";
type Options = AutoCompleteOptions | SelectMixedOption[];

export interface RemoteProps {
  link?: string;
  method?: RequestMethods;
  noQuery?: boolean;
  queryField?: string;
  labelField?: string;
  valueField?: string;
  suffixField?: string;
}

export function useRemoteSearch<T extends Options>(props) {
  const remoteOptions = ref<any>([]) as Ref<T>;
  // const options = computed(() => {
  //     const options: T[] = [...props.options, ...remoteOptions.value];
  //     const formatOptions: Exclude<T, string>[] = options.map((item) => {
  //         if (typeof item === 'string') return { label: item, value: item };
  //         return item;
  //     }) as any;
  //     return formatOptions.filter((item) => item?.label && (item.label as string)?.includes(props.value || ''));
  // });
  const loading = ref(false);
  const onValueUpdate = useDebounceFn(async (value: string) => {
    const key = props.queryField || props.labelField || "keyword";
    if (!props.link) return;
    loading.value = true;
    console.log("remote fetching");
    const { data: res } = await http.fetch(props.link, props.method, {
      [key]: value,
    });
    loading.value = false;
    const list = res.value.data || [];
    remoteOptions.value = list.map((item: string | Record<string, any>) => {
      if (typeof item === "string") return { label: item, value: item };
      const { labelField, suffixField, valueField } = props;
      return {
        ...item,
        label: suffixField
          ? `${item[labelField]}-${item[suffixField]}`
          : item[labelField],
        value: valueField ? item[valueField] : item[labelField],
      };
    });
  }, 200);
  return {
    remoteOptions,
    loading,
    onValueUpdate,
  };
}
