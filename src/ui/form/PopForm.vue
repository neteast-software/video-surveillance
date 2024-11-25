<template>
    <NConfigProvider
        :theme-overrides="naiveThemeOverrides"
        :theme="isDark ? darkTheme : undefined"
        :locale="zhCN"
        :date-locale="dateZhCN"
    >
        <NModal
            class="popForm"
            v-if="placement === 'center'"
            preset="card"
            :style="{ width: '620px', height: `${modalHeight}px` }"
            :close-on-esc="false"
            :show="show"
            @update:show="$emit('update:show', $event)"
            :mask-closable="false"
            :closable="false"
            :header-style="{ paddingLeft: '52px' }"
            :content-style="{ overflow: 'hidden', height: 0, position: 'relative', padding: 0 }"
            :footer-style="{ padding: '24px 52px', borderTop: isDark ? '1px solid #323B49' : '1px solid #E7EAF4' }"
        >
            <template v-if="formConfig.name" #header>
                <div class="flex justify-end">
                    <Icon
                        :icon="closeIcon"
                        class="text-[#707996] w-5.5 h-5.5 hover:bg-grey rounded cursor-pointer"
                        @click="exitFormEdit"
                    ></Icon>
                </div>
                <div>
                    <h2 class="text-1.5xl">{{ formConfig.name }}</h2>
                    <h3 v-if="formConfig.desc">{{ formConfig.desc }}</h3>
                </div>
            </template>
            <div class="h-full" ref="container">
                <NSpin :show="loading" class="h-full">
                    <NScrollbar ref="scrollbar" key="modalScroller" class="relative h-full max-h-full px-14 py-8">
                        <Form
                            ref="formRef"
                            :model-value="formData"
                            :show-button="false"
                            :config="formConfig"
                            :do-operate="doOperate"
                            @update:model-value="$emit('update:formData', $event)"
                            @submit="$emit('submit', $event)"
                            @after-submit="$emit('afterSubmit', $event)"
                            @validate-error="onValidateError"
                        ></Form>
                    </NScrollbar>
                </NSpin>
            </div>
            <template v-if="formConfig.buttons" #footer>
                <div class="flex justify-end">
                    <NButton
                        type="primary"
                        v-if="formConfig.submitUrl"
                        @click="
                            formRef?.makeOperation(
                                {
                                    link: formConfig.submitUrl,
                                    method: formConfig.submitMethod,
                                    type: 'submit',
                                    name: '提交'
                                } as Operation,
                                formData,
                                formConfig
                            )
                        "
                        >提交</NButton
                    >
                    <NButton
                        style="margin-left: 18px"
                        v-for="(button, idx) in formConfig.buttons"
                        :key="idx"
                        type="primary"
                        @click="formRef?.makeOperation(button, formData, formConfig)"
                        >{{ button.name }}</NButton
                    >
                </div>
            </template>
        </NModal>
        <NDrawer
            class="popForm"
            style="min-width: 360px"
            v-else
            :show="show"
            :close-on-esc="false"
            :placement="placement"
            :mask-closable="false"
            :width="width"
            :height="height"
            :native-scrollbar="false"
            :content-style="{ overflow: 'hidden', height: '100%' }"
            @mask-click="onMaskClick"
            @update:show="$emit('update:show', $event)"
        >
            <div ref="container" class="h-full">
                <NSpin :show="loading" class="h-full">
                    <div class="flex h-full max-h-full">
                        <aside class="px-7 pt-13 pb-26 flex flex-col justify-between border-r border-linegrey">
                            <header>
                                <NButton circle block secondary class="!w-9 !h-9 !mb-26" @click="exitFormEdit">
                                    <Icon :icon="comeBack" class="w-6 h-6"></Icon>
                                </NButton>
                                <div
                                    class="mb-12 flex flex-col items-center"
                                    @click="
                                        formRef?.makeOperation(
                                            {
                                                link: formConfig.submitUrl,
                                                method: formConfig.submitMethod || 'POST',
                                                type: 'submit',
                                                name: '提交'
                                            } as Operation,
                                            formData,
                                            formConfig
                                        )
                                    "
                                >
                                    <NButton circle block secondary class="!w-9 !h-9">
                                        <Icon :icon="save" class="w-6 h-6"></Icon>
                                    </NButton>
                                    <span class="text-info text-xs">保存</span>
                                </div>
                                <div class="mb-12 flex flex-col items-center" @click="$emit('reset')">
                                    <NButton circle block secondary class="!w-9 !h-9">
                                        <Icon :icon="resetIcon" class="w-6 h-6"></Icon>
                                    </NButton>
                                    <span class="text-info text-xs">重置</span>
                                </div>
                            </header>
                            <footer class="text-xs">
                                <NButton
                                    v-for="(button, idx) in formConfig.buttons"
                                    :key="idx"
                                    circle
                                    block
                                    :type="idx !== 0 ? 'tertiary' : 'primary'"
                                    :secondary="idx !== 0"
                                    class="!w-9 !h-9 !text-xs !mt-8"
                                    @click="formRef?.makeOperation(button, formData, formConfig)"
                                    >{{ button.name }}</NButton
                                >
                            </footer>
                        </aside>
                        <main class="py-8 w-0 flex-1 relative flex flex-col">
                            <h1 class="text-[22px] mt-8 mx-9">{{ formConfig.name }}</h1>
                            <p class="text-sm text-info mt-1.5 mb-13 mx-9">{{ formConfig.desc }}</p>
                            <NScrollbar class="h-0 flex-1" ref="scrollbar">
                                <Form
                                    ref="formRef"
                                    :model-value="formData"
                                    :config="formConfig"
                                    :show-button="false"
                                    :do-operate="doOperate"
                                    @update:model-value="$emit('update:formData', $event)"
                                    @submit="$emit('submit', $event)"
                                    @after-submit="$emit('afterSubmit', $event)"
                                    @validate-error="onValidateError"
                                    class="mx-9"
                                ></Form>
                            </NScrollbar>
                        </main>
                    </div>
                </NSpin>
            </div>
        </NDrawer>
    </NConfigProvider>
</template>

<script setup lang="ts">
import {
    NModal,
    NDrawer,
    NButton,
    NConfigProvider,
    darkTheme,
    NSpin,
    NScrollbar,
    ScrollbarInst,
    zhCN,
    dateZhCN,
    InternalRowData
} from 'naive-ui';
import useTheme from '../theme';
import Form from './Form.vue';
import { ref, computed, provide } from 'vue';
import type { FormConfig, PopFormPlacement } from './type.ts';
import { Icon } from '@iconify/vue';
// import comeBack from '@eBuild/icons/comeBack';
// import save from '@eBuild/icons/save';
// import closeIcon from '@ebuild/icons/close';
// import resetIcon from '@eBuild/icons/reset';
import { Operation } from '@ebuild/ui/table/type';
import { useElementSize } from '@vueuse/core';
// import useSharedController from '../operation';
const { isDark, naiveThemeOverrides } = useTheme();
const container = ref<HTMLDivElement>();
// const { doOperate } = useSharedController();
const formRef = ref<InstanceType<typeof Form>>();
const { height: bodyHeight } = useElementSize(document.body);
const { height: FormHeight } = useElementSize(formRef);

const modalDefaultHeight = 780;
// const modalContentHeight = 600;
const modalHeight = computed(() => {
    const maxHeight = bodyHeight.value < modalDefaultHeight ? bodyHeight.value - 100 : modalDefaultHeight;
    if (FormHeight.value > maxHeight - 260) {
        return maxHeight;
    }
    return FormHeight.value + 260;
});
interface Props {
    show: boolean;
    title?: string;
    text?: string;
    width?: string | number;
    height?: string | number;
    placement: PopFormPlacement;
    formConfig: FormConfig;
    formData: Record<string, any>;
    doOperate?: (op: Operation, row?: InternalRowData, needRefresh?: boolean) => Promise<void>;
}
withDefaults(defineProps<Props>(), {
    show: false,
    title: '',
    text: '',
    placement: 'right',
    width: '27%'
});
const emits = defineEmits(['update:show', 'update:formData', 'submit', 'afterSubmit', 'reset']);
async function exitFormEdit() {
    await formRef.value?.checkFormUpdated();
    emits('update:show', false);
}
const loading = ref(false);
function showLoading() {
    loading.value = true;
}
function hideLoading() {
    loading.value = false;
}
provide('loading', { showLoading, hideLoading });
function onMaskClick() {
    if (loading.value) {
        window.$message?.warning('表单提交中，请稍等');
        return;
    }
    exitFormEdit();
}
const scrollbar = ref<ScrollbarInst>();
const scrollOffset = 100;
function onValidateError(_, firstErrorEl: HTMLElement) {
    if (!firstErrorEl) return;
    scrollbar.value?.scrollTo({
        top: firstErrorEl.offsetTop - scrollOffset,
        behavior: 'smooth'
    });
}
</script>

<style scoped>
:deep(.n-spin-content) {
    height: 100%;
}
</style>
