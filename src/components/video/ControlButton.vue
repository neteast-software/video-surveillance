<template>
  <button class="flex flex-col items-center text-white text-xs">
    <NButton
      class="!mb-1.5"
      :color="iconBg"
      type="primary"
      circle
      v-bind="buttonProps"
      :style="{
        width: `${props.buttonSize}px`,
        height: `${props.buttonSize}px`,
      }"
    >
      <slot name="icon" :size="iconSize">
        <Icon
          v-if="activeIcon && active"
          :icon="activeIcon"
          :width="iconSize"
          :height="iconSize"
          :color="activeColor"
        ></Icon>
        <Icon v-else :icon="icon" :width="iconSize" :height="iconSize"></Icon>
      </slot>
    </NButton>
    <label class="flex justify-center" :class="labelClass" :style="labelStyle">
      <slot></slot>
    </label>
  </button>
</template>

<script setup lang="ts">
import { Icon, IconifyIcon } from "@iconify/vue";
import { computed, CSSProperties } from "vue";
import { NButton, ButtonProps } from "naive-ui";
import HeroIcon from "@/components/other/HeroIcon.vue";
interface Props {
  icon?: string | IconifyIcon;
  iconSize?: number;
  activeIcon?: string | IconifyIcon;
  activeColor?: string;
  labelClass?: string | Record<string, any> | string[];
  labelStyle?: CSSProperties;
  iconBg?: string;
  active?: boolean;
  buttonSize?: number;
  buttonProps?: Partial<ButtonProps>;
}
const props = withDefaults(defineProps<Props>(), {
  iconSize: 24,
  icon: "",
  activeIcon: "",
  activeColor: "#4476E3",
  iconBg: "rgba(0,0,0,0.5)",
  buttonSize: 42,
  buttonProps: {},
});
defineEmits<{ change: [active: boolean] }>();
const iconWrapSize = computed(() => props.iconSize * 1.75);
// const active = ref(false);
// function deActive() {
//     active.value = false;
// }
</script>

<style scoped></style>
