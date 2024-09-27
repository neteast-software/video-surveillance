<template>
  <NConfigProvider
    class="w-full h-full"
    :theme="isDark ? darkTheme : undefined"
    :theme-overrides="naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <NDialogProvider>
      <NNotificationProvider :max="3">
        <NMessageProvider :max="2">
          <slot></slot>
          <NaiveProviderContent />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  useMessage,
  useNotification,
  useDialog,
  zhCN,
  dateZhCN,
  darkTheme,
} from "naive-ui";
import useTheme, { isDark } from "../../utils/theme";
import { defineComponent, h } from "vue";
// defineOptions({name: 'NaiveProvider'})
const { naiveThemeOverrides } = useTheme();
const NaiveProviderContent = defineComponent({
  name: "NaiveProviderContent",
  setup() {
    window.$message = useMessage();
    window.$notification = useNotification();
    window.$dialog = useDialog();
  },
  render() {
    return h("div", { style: { display: "none" } });
  },
});
</script>

<style scoped></style>
