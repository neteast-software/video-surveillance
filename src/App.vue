<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
    class="fill-parent bg-#F6F8F9 h-full flex-col"
  >
    <NMessageProvider>
      <navbar></navbar>
      <main class="flex flex-h-rest mb-5">
        <sidebar></sidebar>
        <router-view class="text-basic"></router-view>
      </main>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import navbar from "./components/navbar.vue";
import sidebar from "./components/sidebar.vue";
import { NConfigProvider, zhCN, dateZhCN, NMessageProvider } from "naive-ui";
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
// const keyFields = ["tel", "name", "t", "sign"];

// const searchQuery = getQuery(location.href).query;
// Object.keys(searchQuery).forEach((key) => {
//   if (!keyFields.includes(key)) {
//     delete searchQuery[key];
//   } else {
//     searchQuery[key] = decodeURIComponent(searchQuery[key]);
//   }
// });
// localStorage.setItem("searchQuery", JSON.stringify(searchQuery));
</script>

<style scoped></style>
