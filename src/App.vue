<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
    class="fill-parent bg-#F6F8F9 h-full flex-col text-basic"
  >
    <NDialogProvider>
      <NNotificationProvider :max="3">
        <NMessageProvider>
          <navbar></navbar>
          <main class="flex flex-h-rest mb-5 gap-5">
            <sidebar></sidebar>
            <router-view></router-view>
          </main>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import navbar from "./components/navbar.vue";
import sidebar from "./components/sidebar.vue";
import {
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  zhCN,
  dateZhCN,
  NMessageProvider,
} from "naive-ui";
// import { getQuery } from "./api/pack";

const themeOverrides = {
  common: {
    primaryColor: "#165DFF",
  },
  Input: {
    borderFocus: "1px solid #165DFF",
    borderHover: "1px solid #165DFF",
    boxShadowFocus: "0 3px 6px -4px rgba(22,93,255)",
  },
  Select: {
    peers: {
      InternalSelection: {
        borderFocus: "1px solid #165DFF",
        borderHover: "1px solid #165DFF",
        boxShadowFocus: "0 3px 6px -4px rgba(22,93,255)",
        optionTextColor: "red",
      },
    },
  },
  // ...
};
</script>

<style scoped></style>
