<template>
  <div
    class="flex items-center cursor-pointer"
    @click="$emit('update:value', !value)"
  >
    <slot>
      <span>{{ label }}</span>
    </slot>
    <Icon :icon="ArrowIcon" :rotate="value ? -45 : 45" class="w-5 h-5" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
// import ArrowIcon from '@ebuild/icons/arrow';
interface Props {
  label: string;
  value: boolean;
}
withDefaults(defineProps<Props>(), {
  label: "",
  value: false,
});
defineEmits(["update:value"]);
</script>

<style scoped></style>
