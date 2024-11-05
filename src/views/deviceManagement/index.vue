<template>
  <section class="flex-col bg-white px-6 py-7 lt-laptop-(px-3)">
    <div class="flex-y-center text-4 font-600 gap-2">
      <div class="i-icons:equipment w-5 h-5"></div>
      设备管理
    </div>
    <div class="w-full h-1px bg-greyLine mt-5"></div>
    <main class="flex-h-rest">
      <router-view :key="$route.path"></router-view>
    </main>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
