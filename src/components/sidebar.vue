<template>
  <div class="h-full py-4 bg relative border-r-(1px solid greyLine) max-w-58">
    <div class="flex-col h-full">
      <header
        class="flex-center bg-#EFF3F7 rounded-2 p-2 min-w-48 mb-4.5 mx-2.5"
      >
        <img
          :src="user"
          class="w-7.5 h-7.5 rounded-full border-(1 solid white)"
          alt=""
        />
        <div class="text-3.5 flex-w-rest ml-2.5">
          Yaomeier
          <div class="text-(2.5 lightGrey)">1565****367</div>
        </div>

        <NPopover
          trigger="click"
          placement="bottom-end"
          style="padding: 12px 0; border-radius: 8px"
        >
          <template #trigger>
            <div class="w-4 h-4 bg-white flex-center rounded-1 cursor-pointer">
              <div class="i-icons:caretdown w-3 h-3 text-lightGrey"></div>
            </div>
          </template>
          <div
            class="flex-center gap-2.5 py-3 pl-6 pr-8 hover-(text-primary bg-#DFEBFF) cursor-pointer"
            @click="handleLogOut()"
          >
            <div class="i-icons:export w-4 h-4"></div>
            退出登录
          </div>
        </NPopover>
      </header>
      <div class="text-3 text-lightGrey mb-6 lt-laptop-(mb-3) mx-2.5">菜单</div>
      <NScrollbar class="flex-h-rest">
        <NMenu
          ref="menuInstRef"
          :options="menuOptions"
          :value="menuKey"
          @update:value="handleMenuSelect"
        />
      </NScrollbar>
      <div class="h-1px bg-greyLine my-10 lt-laptop-(my-7) mx-2.5"></div>
      <div class="z-1 mx-2.5">
        <div class="text-(3 lightGrey) mb-6">数据</div>
        <div>
          <div>安全帽在线人数</div>
          <NAvatarGroup :options="options" :size="36" :max="4" class="my-4">
            <template #avatar="{ option: { name, src } }">
              <n-tooltip>
                <template #trigger>
                  <n-avatar :src="src" />
                </template>
                {{ name }}
              </n-tooltip>
            </template>
            <template #rest="{ options: restOptions, rest }">
              <n-avatar>+{{ rest }}</n-avatar>
            </template>
          </NAvatarGroup>
          <div class="w-full bg-#EFF3F7/70 rounded-2 px-2.5 py-4">
            <div class="text-3">
              安全帽在线率
              <n-progress
                type="line"
                class="mt-3"
                :percentage="onlineRate?.safetyHelmetRate"
                color="#3563EF"
                rail-color="#A4BAF4"
              />
            </div>
            <div class="w-full h-1px bg-#E1E7EB my-3"></div>
            <div>设备在线率</div>
            <n-progress
              type="line"
              class="mt-3"
              :percentage="onlineRate?.channelRate"
              color="#3563EF"
              rail-color="#A4BAF4"
            />
          </div>
        </div>
      </div>
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
  MenuInst,
  NPopover,
  useDialog,
} from "naive-ui";
import user from "@/assets/imgs/user.png";
import { menuOptions } from "../router";
import { useRoute, useRouter } from "vue-router";
import { getOnlineRate } from "@/utils/network/api/index";
import { OnlineRate } from "@/utils/network/types/index";
import { computed, watch, ref, onMounted, nextTick } from "vue";
import { logout } from "@/utils/network/api/root";
import storage from "@/utils/other/storage";

const router = useRouter();
const route = useRoute();
const menuInstRef = ref<MenuInst | null>(null);
const dialog = useDialog();

function handleMenuSelect(key: string) {
  console.log("key", key);
  router.push(key);
}
const menuKey = computed(() => {
  // return router.currentRoute.value.path as string;
  return route.path;
});
watch(menuOptions, async (options) => {
  if (options) {
    console.log("menuOptions更新", options);
    await nextTick();
    setTimeout(() => {
      menuInstRef.value?.showOption(route.path);
    }, 100);
  }
});

const onlineRate = ref<OnlineRate>();
async function initData() {
  const { data } = await getOnlineRate();
  onlineRate.value = data;
}
onMounted(initData);

const options = computed(() => {
  return onlineRate.value?.safetyHelmetVos.map((option) => {
    return {
      name: option.name,
      src: option.img || user,
    };
  });
});

function handleLogOut() {
  dialog.create({
    title: "退出登录",
    content: "确定要退出登录吗？退出后数据将会自动同步",
    positiveText: "确定退出",
    negativeText: "取消",
    // maskClosable: false, //点击遮罩
    onPositiveClick: async () => {
      try {
        await logout("admin");
        storage.remove("access_token");
      } catch (error) {
        console.error("请求失败", error);
      }
    },
    onNegativeClick: () => {
      console.log("取消");
    },
  });
}
</script>

<style scoped>
.bg {
  background: linear-gradient(180deg, #ffffff 76%, #e3ebff 100%);
}
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  @apply text-(primary  3) absolute -top-7.5 right-2;
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
