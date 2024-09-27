import { DialogOptions, useDialog, NInput } from "naive-ui";
import { h, ref } from "vue";
import Title from "./Title.vue";
import Action from "./Action.vue";
import Content from "./Content.vue";

export type DialogFunc = (options: DialogOptions) => Promise<unknown>;
export function useDialogAsync() {
  const dialog = window.$dialog || useDialog();
  function confirmDialog(options: DialogOptions) {
    console.log("confirmDialog", options);
    return new Promise((resolve, reject) => {
      dialog.warning({
        positiveText: "确认",
        negativeText: "取消",
        ...options,
        content: () => h(Content, null, { default: () => options.content }),
        title: () => h(Title, null, { default: () => options.title }),
        // action: () => h(Action, null, { action: () => options.action }),
        positiveButtonProps: { type: "primary" },
        negativeButtonProps: {
          type: "default",
          secondary: true,
          text: false,
          color: "#2B3D56",
          style: { background: "#F2F2F2" },
        },
        onPositiveClick: resolve,
        onNegativeClick: reject,
      });
    });
  }
  function promptDialog(options: DialogOptions, value = "") {
    const input = ref(value);
    return new Promise<string>((resolve, reject) => {
      dialog.warning({
        positiveText: "确认",
        negativeText: "取消",
        ...options,
        title: () => h(Title, null, { default: () => options.title }),
        content: () =>
          h(NInput, {
            value: input.value,
            "onUpdate:value": (val) => (input.value = val),
            placeholder: options.content,
          }),
        positiveButtonProps: { type: "primary" },
        negativeButtonProps: {
          type: "default",
          secondary: true,
          text: false,
          style: { background: "#F2F2F2" },
        },
        onPositiveClick: () => {
          if (!input.value) return reject();
          resolve(input.value);
        },
        onNegativeClick: reject,
      });
    });
  }
  async function deleteRecord() {
    await confirmDialog({
      title: "删除",
      content: () => h(Content, null, { default: () => "测试" }),
    });
  }
  return {
    confirmDialog,
    promptDialog,
  };
}
