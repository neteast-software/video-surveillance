<template>
  <div class="h-full py-4 bg relative border-r-(2px solid greyLine)">
    <div class="flex-col h-full">
      <header
        class="flex-center bg-#EFF3F7 rounded-2 p-2 min-w-48 mb-4.5 mx-2.5"
      >
        <img :src="user" class="w-7.5 h-7.5 rounded-full" alt="" />
        <div class="text-3.5 flex-w-rest ml-2.5">
          Yaomeier
          <div class="text-(2.5 lightGrey)">1565****367</div>
        </div>
        <div class="w-4 h-4 bg-white flex-center">
          <div class="i-icons:caretdown w-3 h-3 text-lightGrey"></div>
        </div>
      </header>
      <div class="text-3 text-lightGrey mb-6 lt-laptop-(mb-3) mx-2.5">菜单</div>
      <NScrollbar class="flex-h-rest">
        <NMenu
          :options="menuOptions"
          :value="menuKey"
          @update:value="handleMenuSelect"
        />
      </NScrollbar>
      <div class="w-full h-1px bg-greyLine my-10 lt-laptop-(my-7) mx-2.5"></div>
      <div class="z-1 mx-2.5">
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
          <div class="w-full bg-#EFF3F7 rounded-2 px-2.5 py-4">
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
      <!-- <div
        class="w-10 min-h-10 bg-white rounded-2 flex-center cursor-pointer z-1 mt-3 hover:scale-106 transition"
      >
        <div class="i-icons:export w-6 h-6 text-lightGrey"></div>
      </div> -->
    </div>
    <img
      src="../assets/imgs/sidebar-bg.png"
      class="absolute bottom-0 left-0 w-full z-0"
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
  NScrollbar,
} from "naive-ui";
import user from "@/assets/imgs/user.png";
import { menuOptions } from "../router";
import { useRouter } from "vue-router";
import { computed } from "vue";
const router = useRouter();
function handleMenuSelect(key: string) {
  console.log("key", key);
  router.push(key);
}
const menuKey = computed(() => {
  return router.currentRoute.value.path as string;
});

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
/* :deep(.n-scrollbar-rail__scrollbar) {
  display: none;
} */
:deep(.n-menu .n-menu-item) {
  @apply lt-laptop-(mt-3) mt-4;
}
:deep(.n-menu .n-submenu-children) {
  @apply relative;
}
:deep(.n-menu .n-submenu-children::before) {
  content: "";
  position: absolute;
  width: 1px;
  height: calc(100% - 24px);
  background: #dddddd;
  @apply left-11 top-2;
}
:deep(.n-menu .n-submenu-children .n-menu-item) {
  @apply relative;
}
:deep(.n-menu .n-submenu-children .n-menu-item::before) {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-image: url("../assets/svgs/angle.svg");
  background-position: left bottom;
  background-size: 8px 8px;
  @apply left-11 top-1/2 -translate-y-1/2;
}
:deep(.n-menu .n-submenu-children .n-menu-item-content) {
  @apply ml-3;
}
:deep(.n-menu .n-submenu-children .n-menu-item-content::before) {
  @apply left-12.5;
}
:deep(.n-menu .n-menu-item-content) {
  @apply !pl-6;
}
:deep(.n-menu .n-menu-item-content-header) {
  @apply text-4;
}
:deep(.n-menu .n-submenu-children .n-menu-item-content-header) {
  @apply text-3.5;
}
</style>
