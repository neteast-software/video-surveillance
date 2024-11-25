<template>
    <NPopover
        :show="isShow"
        :content-style="{ height: '400px' }"
        :width="320"
        :show-arrow="false"
        @clickoutside="isShow = false"
    >
        <template #trigger>
            <NInput
                :value="value"
                @click="isShow = true"
                clearable
                @update:value="$emit('update:value', $event)"
                @clear="$emit('update:value', '')"
            >
                <template v-if="value" #prefix>
                    <Icon :icon="value"></Icon>
                </template>
            </NInput>
        </template>
        <div class="h-full flex flex-col overflow-hidden">
            <!-- <NInput v-model:value="searchIcon" placeholder="请输入图标名称"></NInput> -->
            <NScrollbar v-if="iconList.length" class="h-0 flex-1 mt-4">
                <div
                    class="flex items-center cursor-pointer hover:bg-linegrey rounded p-1 rounded"
                    v-for="item in iconList"
                    :key="item"
                    @click="
                        $emit('update:value', item);
                        isShow = false;
                    "
                >
                    <Icon :icon="item" width="20"></Icon>
                    <span class="ml-2">{{ getIconName(item) }}</span>
                </div>
            </NScrollbar>
            <div v-else class="h-full flex-center">
                <NEmpty></NEmpty>
            </div>
        </div>
    </NPopover>
</template>

<script setup lang="ts">
import { NInput, NScrollbar, NPopover, NEmpty } from 'naive-ui';
import { listIcons, Icon } from '@iconify/vue';
import { ref, computed } from 'vue';
defineOptions({ inheritAttrs: false });
interface Props {
    value: string;
    iconSet?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
    value: '',
    iconSet: () => ['menuicons', 'heroicons']
});
defineEmits(['update:value']);
const isShow = ref(false);
// const selectedIcon = ref('');
// const searchIcon = ref('');
const icons = computed(() => {
    const { iconSet } = props;
    return Array.isArray(iconSet) ? iconSet.map((prefix) => listIcons('', prefix)).flat() : listIcons('', iconSet);
    // return listIcons('', iconSet).filter((item) => {
    //     return !item.includes('20');
    // });
});
const iconList = computed(() => {
    return icons.value.filter((item) => item.includes(props.value || ''));
});
function getIconName(iconName) {
    const arr = iconName.split(':');
    return arr[arr.length - 1];
}
</script>

<style scoped>
.icon-list {
    display: grid;
    /* grid-template-columns: auto; */
}
</style>
