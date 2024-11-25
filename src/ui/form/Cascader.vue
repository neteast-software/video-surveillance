<template>
    <NCascader
        :options="options"
        :remote="remote || !!link"
        :label-field="labelField"
        :value-field="valueField"
        :children-field="childrenField"
        :render-label="renderLabel"
    ></NCascader>
</template>

<script setup lang="ts">
import { NCascader, CascaderOption, NPopover, CascaderProps } from 'naive-ui';
import { RemoteProps, useRemoteSearch } from './remote';
import { computed, h, watch } from 'vue';
export interface Props extends RemoteProps {
    remote?: boolean;
    options?: CascaderOption[];
    childrenField?: string;
}
const props = withDefaults(defineProps<Props>(), {});
const { remoteOptions, onValueUpdate } = useRemoteSearch<CascaderOption[]>(props);
if (props.remote || props.link) {
    onValueUpdate('');
}
const options = computed<CascaderOption[]>(() => {
    const { options, remote, link } = props;
    if (remote || link) return remoteOptions.value;
    return options || [];
});

const renderLabel: CascaderProps['renderLabel'] = (data) => {
    const { labelField } = props;
    const label = data[labelField as string] as string;
    return h(
        NPopover,
        {
            disabled: !label || label.length < 9
        },
        {
            default: () => label,
            trigger: () => label || ''
        }
    );
};
</script>

<style scoped></style>
