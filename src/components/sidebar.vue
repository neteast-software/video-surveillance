<template>
  <div class="h-full px-2.5 py-4 bg rounded-2 relative">
    <div class="flex-col justify-between gap-3 h-full">
      <header class="flex-center bg-greyBg rounded-2 p-2 min-w-48 mb-4.5">
        <img :src="user" class="w-7.5 h-7.5 rounded-full" alt="" />
        <div class="text-3.5 flex-w-rest ml-2.5">
          Yaomeier
          <div class="text-(2.5 lightGrey)">1565****367</div>
        </div>
        <div class="w-4 h-4 bg-white flex-center">
          <div class="i-icons:caretdown w-3 h-3 text-lightGrey"></div>
        </div>
      </header>
      <NScrollbar trigger="none">
        <div>
          <div class="text-3 text-lightGrey mb-6">菜单</div>
          <NMenu
            :options="menuOptions"
            :value="menuKey"
            @update:value="handleMenuSelect"
          />
        </div>
        <div class="w-full h-1px bg-greyLine my-10"></div>
        <div>
          <div class="text-(3 lightGrey) mb-6">数据</div>
          <div>
            <div>安全帽在线人数</div>
            <NAvatarGroup :options="options" :size="40" :max="3" class="my-4">
              <template #avatar="{ option: { label, src } }">
                <n-tooltip>
                  <template #trigger>
                    <n-avatar :src="src" />
                  </template>
                  {{ label }}
                </n-tooltip>
              </template>
              <template #rest="{ options: restOptions, rest }">
                <n-avatar>+{{ rest }}</n-avatar>
              </template>
            </NAvatarGroup>
            <div class="w-full bg-greyBg rounded-2 px-2.5 py-4">
              <div>
                安全帽在线率
                <n-progress
                  type="line"
                  class="mt-3"
                  :percentage="80"
                  color="#3563EF"
                  rail-color="#A4BAF4"
                />
              </div>
              <div class="w-full h-1px bg-#E1E7EB my-3"></div>
              <div>设备在线率</div>
              <n-progress
                type="line"
                class="mt-3"
                :percentage="60"
                color="#3563EF"
                rail-color="#A4BAF4"
              />
            </div>
          </div>
        </div>
      </NScrollbar>
      <div class="w-10 min-h-10 bg-white rounded-2 flex-center">
        <div class="i-icons:export w-6 h-6 text-lightGrey"></div>
      </div>
    </div>
    <img
      src="../assets/imgs/sidebar-bg.png"
      class="absolute bottom-0 left-0 w-full"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import {
  NAvatarGroup,
  NAvatar,
  NTooltip,
  NProgress,
  NMenu,
  MenuOption,
  NScrollbar,
} from "naive-ui";
import user from "../assets/imgs/user.png";
import { createMenu } from "../utils/other/createMenu";
import { routes } from "../router";
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";
const router = useRouter();
const route = useRoute();
function handleMenuSelect(key: string) {
  console.log("key", key);
  router.push(key);
}
const menuKey = computed(() => {
  return router.currentRoute.value.name as string;
});

const menuOptions = createMenu(routes);

const options = [
  {
    label: "Tom",
    src: user,
  },
  {
    label: "Tom",
    src: user,
  },
  {
    label: "Tom",
    src: user,
  },
  {
    label: "Tom",
    src: user,
  },
];
</script>

<style scoped>
.bg {
  background: linear-gradient(180deg, #ffffff 76%, #e3ebff 100%);
}
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  position: absolute;
  right: 0;
  top: -30px;
}
:deep(.n-scrollbar-rail__scrollbar) {
  display: none;
}
</style>
