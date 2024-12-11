import { DialogOptions, useDialog, NInput } from "naive-ui";
import { h, ref } from "vue";
import Title from "./Title.vue";
import Action from "./Action.vue";
import Content from "./Content.vue";
import { FormConfig } from "@/ui/form/type";
import http from "@/utils/network/http";

export type DialogFunc = (options: DialogOptions) => Promise<unknown>;
interface ConfirmDialogOptions extends DialogOptions {
	formConfig?: FormConfig;
}
export function confirmDialog(options: ConfirmDialogOptions) {
	const dialog = window.$dialog || useDialog();
	const { formConfig } = options;
	const formData = ref<Record<string, any>>({});
	const contentRef = ref<InstanceType<typeof Content>>();
	return new Promise<any>((resolve, reject) => {
		const d = dialog.create({
			type: "warning",
			positiveText: "确认",
			negativeText: "取消",
			maskClosable: false,
			style: {
				minWidth: "446px",
				width: "auto",
			},
			...options,
			content: () =>
				h(
					Content,
					{
						formConfig,
						formData: formData.value,
						"onUpdate:formData": (val: Record<string, any>) => {
							formData.value = val;
						},
						ref: (el: any) => {
							contentRef.value = el;
						},
					},
					{ default: () => options.content }
				),
			title: () => h(Title, null, { default: () => options.title }),
			// action: () => h(Action, null, { action: () => options.action }),
			positiveButtonProps: { type: "primary" },
			negativeButtonProps: {
				type: "default",
				// secondary: true,
				quaternary: true,
				// text: true,
				color: "#2B3D56",
			},
			onPositiveClick: async () => {
				if (
					formConfig &&
					formConfig.items?.length &&
					formConfig.submitUrl
				) {
					d.loading = true;
					await contentRef.value?.formRef?.checkForm().catch((e) => {
						e.loading = false;
						return Promise.reject(e);
					});
					const { submitMethod, submitUrl } = formConfig;
					return new Promise<void>((reso) => {
						http.fetch(submitUrl, submitMethod, formData.value)
							.then(resolve, reject)
							.finally(reso);
					});
				}
				resolve(true);
			},
			onNegativeClick: reject,
			onClose: reject,
		});
	});
}
export function useDialogAsync() {
	const dialog = window.$dialog || useDialog();
	// function confirmDialog(options: DialogOptions) {
	//     return new Promise((resolve, reject) => {
	//         dialog.warning({
	//             positiveText: '确认',
	//             negativeText: '取消',
	//             maskClosable: false,
	//             ...options,
	//             content: () => h(Content, null, { default: () => options.content }),
	//             title: () => h(Title, null, { default: () => options.title }),
	//             // action: () => h(Action, null, { action: () => options.action }),
	//             positiveButtonProps: { type: 'primary' },
	//             negativeButtonProps: {
	//                 type: 'default',
	//                 secondary: true,
	//                 text: false,
	//                 color: '#2B3D56',
	//                 style: { background: '#F2F2F2' }
	//             },
	//             onPositiveClick: resolve,
	//             onNegativeClick: reject,
	//             onClose: reject
	//         });
	//     });
	// }
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
