<template>
  <div class="h-full flex flex-col pt-6">
    <NInput class="mb-6 !w-[614px]" placeholder="请输入搜索内容">
      <template #suffix>
        <Icon :icon="magnifier" class="w-5 h-5"></Icon>
      </template>
    </NInput>
    <ul class="h-0 flex-1">
      <NScrollbar>
        <li class="flex justify-between" v-for="item in 24" :key="item">
          <span class="flex items-center"
            ><NAvatar class="mr-3 w-7 h-7" circle></NAvatar>Tom陈经理</span
          >
          <span>136 6899 0090</span>
          <span>AL23124213</span>
          <span>行政部</span>
          <span>总经理</span>
          <span>
            <NButton class="mx-4" text type="primary">修改</NButton>
            <NButton class="mx-4" text type="warning">修改</NButton>
          </span>
        </li>
      </NScrollbar>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { NInput, NAvatar, NButton, NScrollbar } from "naive-ui";
import { Icon } from "@iconify/vue";
// import magnifier from '@ebuild/icons/magnifier';
</script>

<style scoped></style>
