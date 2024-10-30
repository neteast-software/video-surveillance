<template>
  <LkNaiveProvider
    class="fill-parent bg-#F6F8F9 h-full flex-col text-basic"
    :naive-theme-overrides="themeOverrides"
  >
    <navbar v-model:showModal="showModal"></navbar>
    <main class="flex flex-h-rest">
      <!--  v-if="isLogin" -->
      <NModal
        v-model:show="showModal"
        transform-origin="center"
        :mask-closable="false"
      >
        <notice v-model:showModal="showModal"></notice>
      </NModal>
      <sidebar></sidebar>
      <div class="flex-w-rest">
        <router-view v-slot="{ Component }" class="relative p-5">
          <transition name="fade" mode="out-in">
            <component
              :is="Component"
              class="absolute top-0 left-0 w-full h-full bg-white"
            />
          </transition>
        </router-view>
      </div>
    </main>
    <!-- <template v-else>
      <NSpin class="absolute-center" size="large">
        <template #description> 登录中 </template>
      </NSpin>
    </template> -->
  </LkNaiveProvider>
</template>

<script setup lang="ts">
import navbar from "./components/navbar.vue";
import sidebar from "./components/sidebar.vue";
import { LkNaiveProvider } from "linker-uii";
import { GlobalThemeOverrides, NModal, NSpin } from "naive-ui";
import notice from "./components/notice/index.vue";
import { ref } from "vue";

const showModal = ref(false);

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#3563EF",
    infoColor: "#8A92A6",
    successColor: "#4DC591",
    warningColor: "#FF7648",
  },
  Input: {
    borderFocus: "1px solid #3563EF",
    borderHover: "1px solid #3563EF",
    boxShadowFocus: "0 3px 6px -4px rgba(22,93,255)",
  },
  Select: {
    peers: {
      InternalSelection: {
        borderFocus: "1px solid #3563EF",
        borderHover: "1px solid #3563EF",
        boxShadowFocus: "0 3px 6px -4px rgba(22,93,255)",
        // optionTextColor: "red",
      },
    },
  },
  Menu: {
    itemHeight: "36px",
  },
  Tag: {
    textColorPrimary: "#3563EF",
    colorPrimary: "#DFEBFF",
    textColorInfo: "#8A92A6",
    colorInfo: "#D4D7DF",
    textColorSuccess: "#4DC591",
    colorSuccess: "#E8FFF5",
    textColorWarning: "#FF7648",
    colorWarning: "#FFF0D4",
  },
  Button: {
    borderHover: "1px solid #3563EF",
    textColorHover: "#3563EF",
    colorHover: "#F94144",
    colorPressed: "#F94144",
    // borderPressed: "1px solid #F94144",
    borderFocus: "1px solid #3563EF",
    textColorFocus: "#3563EF",
    borderPressed: "1px solid #3563EF",
    textColorPressed: "#3563EF",
  },
  Popselect: {
    extraTextColor: "#3563EF",
    railColor: "#3563EF",
  },

  // ...
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translatex(6px);
}

.fade-enter-to {
  opacity: 1;
  transform: translatex(0);
}
.fade-leave-from {
  opacity: 1;
  transform: translatex(0);
}
.fade-leave-to {
  opacity: 0;
  transform: translatex(6px);
}

:deep(.n-button):hover {
  background-color: #3563ef;
}
:deep(.n-button):focus {
  background-color: #3563ef;
}
</style>
