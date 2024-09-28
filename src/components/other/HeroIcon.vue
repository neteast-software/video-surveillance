<template>
    <Icon v-bind="props" :icon="icon"></Icon>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { IconifyIcon, IconifyRenderMode, IconifyIconSize } from '@iconify/vue';
// import heroicons from '@iconify-json/heroicons';
import { computed } from 'vue';
export interface Props {
    icon: IconifyIcon | string;
    color?: string;
    mode?: IconifyRenderMode;
    flip?: string;
    width?: IconifyIconSize;
    height?: IconifyIconSize;
    rotate?: number;
    inline?: boolean;
    hFlip?: boolean;
    vFlip?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    inline: true
});
const icon = computed(() => {
    const { icon } = props;
    if (typeof icon === 'string' && !icon.startsWith('heroicons:')) return `heroicons:${icon}`;
    return icon;
});
</script>

<style scoped>
svg {
    display: inline-block;
}
::v-deep(svg) {
    display: inline-block;
}
</style>
