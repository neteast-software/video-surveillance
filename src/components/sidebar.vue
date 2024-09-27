<template>
  <div class="h-full px-2.5 py-4 bg-white rounded-2">
    <header class="flex-center bg-greyBg rounded-2 p-2 min-w-48 mb-7.5">
      <img
        src="../assets/imgs/user@1x.png"
        class="w-7.5 h-7.5 rounded-full"
        alt=""
      />
      <div class="text-3.5 flex-w-rest ml-2.5">
        Yaomeier
        <div class="text-(2.5 greyText)">1565****367</div>
      </div>
      <div class="w-4 h-4 bg-white flex-center">
        <img src="../assets/common/caret-down.svg" class="w-3 h-3" alt="" />
      </div>
    </header>
    <div>
      <div class="text-(3 greyText) mb-6">菜单</div>
      <div class="flex px-3.5 py-4 w-full">
        <img src="../assets/common/home.svg" class="mr-2" alt="" />
        首页
      </div>
      <div class="flex px-3.5 py-4 w-full">
        <img src="../assets/common/equipment.svg" class="mr-2" alt="" />
        设备管理
      </div>
      <div class="flex px-3.5 py-4 w-full">
        <img src="../assets/common/dashboard.svg" class="mr-2" alt="" />
        综合看板
      </div>
      <div class="flex px-3.5 py-4 w-full">
        <img src="../assets/common/state.svg" class="mr-2" alt="" />
        状态监测
      </div>
      <div class="flex px-3.5 py-4 w-full">
        <img src="../assets/common/settings.svg" class="mr-2" alt="" />
        状态监测系统设置
      </div>
    </div>
    <div class="w-full h-1px bg-greyLine"></div>
    <div>
      <div class="text-(3 greyText) mb-6">数据</div>
      <div>
        <div>安全帽在线人数</div>
        <NAvatarGroup :options="options" :size="40" :max="3" class="my-4">
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
  </div>
</template>

<script setup lang="ts">
import { NAvatarGroup, NAvatar, NTooltip, NProgress } from "naive-ui";
import user from "../assets/imgs/user@1x.png";
const options = [
  {
    name: "Tom",
    src: user,
  },
  {
    name: "Tom",
    src: user,
  },
  {
    name: "Tom",
    src: user,
  },
  {
    name: "Tom",
    src: user,
  },
];
</script>

<style scoped>
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  position: absolute;
  right: 0;
  top: -30px;
}
</style>
