<template>
    <NInput v-if="quick" ref="inputInstRef" :value="value">
        <template #prefix>
            <template v-if="prefixIcon">
                <HeroIcon v-if="typeof prefixIcon === 'string'" :icon="prefixIcon"></HeroIcon>
                <HeroIcon v-else v-bind="prefixIcon"></HeroIcon>
            </template>
            <template v-else-if="prefixText">
                <span>{{ prefixText }}</span>
            </template>
        </template>
        <template #suffix>
            <template v-if="suffixIcon">
                <HeroIcon v-if="typeof suffixIcon === 'string'" :icon="suffixIcon"></HeroIcon>
                <HeroIcon v-else v-bind="suffixIcon"></HeroIcon>
            </template>
            <template v-else-if="suffixText">
                <span>{{ suffixText }}</span>
            </template>
        </template>
    </NInput>
    <NInput v-else ref="inputInstRef" v-model:value="actualValue">
        <template #prefix>
            <template v-if="prefixIcon">
                <HeroIcon v-if="typeof prefixIcon === 'string'" :icon="prefixIcon"></HeroIcon>
                <HeroIcon v-else v-bind="prefixIcon"></HeroIcon>
            </template>
            <template v-else-if="prefixText">
                <span>{{ prefixText }}</span>
            </template>
        </template>
        <template #suffix>
            <template v-if="suffixIcon">
                <HeroIcon v-if="typeof suffixIcon === 'string'" :icon="suffixIcon"></HeroIcon>
                <HeroIcon v-else v-bind="suffixIcon"></HeroIcon>
            </template>
            <template v-else-if="suffixText">
                <span>{{ suffixText }}</span>
            </template>
        </template>
    </NInput>
</template>

<script setup lang="ts">
import { type InputProps, NInput, InputInst } from 'naive-ui';
import type { Props as HeroIconProps } from '../other/HeroIcon.vue';
import { ref, watch } from 'vue';

type BaseSlot = string | HeroIconProps;
interface Props {
    value: InputProps['value'];
    quick?: boolean;
    defaultValue: InputProps['defaultValue'];
    prefixIcon?: BaseSlot;
    suffixIcon?: BaseSlot;
    prefixText?: string;
    suffixText?: string;
}

const props = withDefaults(defineProps<Props>(), {});
const inputInstRef = ref<InputInst | null>(null);
const actualValue = ref(props.defaultValue);
watch(
    () => props.defaultValue,
    (val) => {
        actualValue.value = val;
    }
);
// watch(
//     () => props.formValue,
//     (val) => {
//         if (val) return;
//         const { value: inputInst } = inputInstRef;
//         if (!inputInst) return;
//         const { inputElRef, textareaElRef } = inputInst;
//         nextTick(() => {
//             if (inputElRef) inputElRef.value = '';
//             if (textareaElRef) textareaElRef.value = '';
//         });
//     }
// );
// inputInstRef.value?.inputElRef.
</script>

<style scoped></style>
