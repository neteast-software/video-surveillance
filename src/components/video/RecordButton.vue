<template>
    <ControlButton
        v-if="!isRecording"
        @click="
            isRecording = true;
            $emit('record');
        "
    >
        <template #icon>
            <div
                class="w-5 h-5 rounded-full bg-white/50 relative after:absolute-center after:w-[68.4%] after:h-[68.4%] after:rounded-full after:bg-error"
            ></div>
        </template>
        录制
    </ControlButton>
    <ControlButton
        v-else
        @click="
            isRecording = false;
            $emit('finish');
        "
    >
        <template #icon>
            <div
                class="w-5 h-5 rounded-full bg-white/50 relative after:absolute-center after:w-[55%] after:h-[55%] after:rounded-sm after:bg-error"
            ></div>
        </template>
        录制中
    </ControlButton>
</template>

<script setup lang="ts">
import ControlButton from './ControlButton.vue';
import { ref } from 'vue';
const isRecording = ref(false);
defineEmits<{
    record: [];
    finish: [];
}>();
</script>

<style scoped></style>
