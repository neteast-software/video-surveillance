import {
  onBeforeUnmount,
  ref,
  watchEffect,
  shallowRef,
  getCurrentInstance,
  Ref,
  unref,
  render,
  computed,
} from "vue";
import PopForm from "@ebuild/ui/form/PopForm.vue";
import type {
  FormConfig,
  PopFormPlacement,
  FormData,
} from "@ebuild/ui/form/type";
import { useMounted } from "@vueuse/core";
import { createVComponent } from "@/utils/render";
import { FormGraph } from "../graph/type";
import { NOOP, isEmptyObject } from "@/utils/other";
import { confirmDialog } from "@ebuild/ui/dialog";
import { isDef } from "@/utils/validator";

export function useForm(
  el: Ref<HTMLElement | undefined> | HTMLElement = document.body,
  immediate = true
) {
  const isShow = ref(false);
  const width = ref<string | number>();
  const height = ref<string | number>();
  const placement = ref<PopFormPlacement>("right");
  const formConfig = shallowRef<FormConfig>({ items: [] });
  const formData = ref<FormData>({});
  const mouted = useMounted();
  const doOperate = ref<(...args: any[]) => void>(() => {});
  const instance = getCurrentInstance();
  const destroyComp = immediate ? () => render(null, unref(el)!) : NOOP;
  const vnode = computed(() =>
    createVComponent({
      component: PopForm,
      props: {
        show: isShow.value,
        placement: placement.value,
        width: width.value,
        height: height.value,
        formConfig: formConfig.value,
        formData: formData.value,
        doOperate: doOperate.value,
        "onUpdate:show": (val: boolean) => {
          if (!val) {
            hideForm();
            return;
          }
          isShow.value = val;
        },
        "onUpdate:formData": (val: FormData) => {
          console.log("最外层的更新数据", val);
          formData.value = val;
        },
        onReset: async () => {
          await confirmDialog({
            title: "警告",
            content: "重置会清除所有的表单值，确定要重置吗？",
          });
          formData.value = {};
        },
        onSubmit: (val: FormData) => {},
        onAfterSubmit: () => {
          // refresh();
        },
        onAfterLeave: () => {
          formData.value = {};
        },
      },
      appContext: instance!.appContext,
    })
  );
  if (immediate) {
    watchEffect(() => {
      if (!mouted.value) return;
      const container = unref(el);
      if (!container) return;
      render(unref(vnode), container);
    });
  }

  function showForm(graph: FormGraph, data: Record<string, any> = {}) {
    // if (!isEmptyObject(data)) {
    //     graph.items = graph.items.map((item) => {
    //         if (isDef(data?.[item.name])) {
    //             item.value = data?.[item.name];
    //         }
    //         return item;
    //     });
    // }
    // const defaultValues = Object.fromEntries(graph.items.map((item) => [item.name, item.value]));
    formConfig.value = graph;
    formData.value = {
      ...data,
      ...Object.fromEntries(
        graph.items.map((item) => [
          item.name,
          isDef(data?.[item.name]) ? data?.[item.name] : item.value,
        ])
      ),
    };
    placement.value = graph.placement || "right";
    width.value = graph.widthPercent || graph.width;
    height.value = graph.heightPercent || graph.height;
    isShow.value = true;
  }
  function hideForm() {
    if (!isShow.value) return;
    formData.value = {};
    isShow.value = false;
  }
  function changeDoOperate(_doOperate) {
    doOperate.value = _doOperate;
  }
  if (instance) {
    onBeforeUnmount(() => {
      destroyComp?.();
    });
  }
  return {
    showForm,
    hideForm,
    changeDoOperate,
    vnode,
  };
  // return singleton;
}

// export default createSharedComposable(useForm);
