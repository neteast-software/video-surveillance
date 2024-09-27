<template>
    <div
        class="w-32 h-24 rounded overflow-hidden relative laptop:w-40 laptop:h-30 bg-grey shadow-common hover:shadow-common-hover"
    >
        <NImage
            class="w-full h-full myImg"
            object-fit="cover"
            :src="origin + monitor.imgAddr"
            :fallback-src="fallbackUrl"
            preview-disabled
        ></NImage>
        <!-- <img class="w-full h-full" src="../../assets//bg-monitor.png" /> -->
        <NTooltip trigger="hover">
            <template #trigger>
                <div
                    class="absolute right-2 top-2 w-2.5 h-2.5 rounded-full offline"
                    :class="{ online: monitor?.online }"
                ></div>
            </template>
            <span>{{ monitor?.online ? '在线' : '离线' }}</span>
        </NTooltip>
        <NTooltip trigger="hover" placement="bottom">
            <template #trigger>
                <div
                    class="absolute bottom-2 left-1/2 -translate-x-1/2 text-white rounded-full px-3 py-1 max-w-[90%] text-xs bg-inverse/50 truncate flex items-center cursor-pointer"
                >
                    {{ monitor?.channelName }}
                </div>
            </template>
            <span class="cursor-default" @click.stop="copyName(nvrName, monitor!.channelName)">{{
                monitor?.channelName
            }}</span>
        </NTooltip>
    </div>
</template>

<script setup lang="ts">
import { NTooltip, NImage } from 'naive-ui';
import type { MonitorListItem } from '@ebuild/utils/network/types/security';
import { ChannelItem } from '@ebuild/utils/network/api/security';
interface Props {
    nvrName: string;
    monitor: ChannelItem;
}
withDefaults(defineProps<Props>(), {});
const origin = location.origin;
// const origin = 'http://218.85.23.25:13402/';
const fallbackUrl = new URL('../../assets/bg-monitor.jpeg', import.meta.url).href;
function copyName(nvrName: string, chName: string) {
    navigator.clipboard
        .writeText(`${nvrName} ${chName}`)
        .then(() => {
            window.$message?.success('文本已成功复制到剪贴板');
        })
        .catch(() => {
            window.$message?.error('复制失败');
        });
}
</script>

<style scoped>
.online {
    @apply !bg-success;
}
.offline {
    @apply bg-[#707996];
}
::v-deep(.n-image img) {
    width: 100% !important;
}
.myImg img {
    width: 100% !important;
}
</style>
