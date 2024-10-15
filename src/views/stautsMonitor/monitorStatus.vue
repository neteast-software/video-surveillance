<template>
  <div class="dataframe">
    <h1>监控状态</h1>
    <div class="flex gap-6 lt-laptop-(gap-3) mt-3">
      <div
        class="blue-gradient flex flex-y-center gap-9 px-7 py-6 w-full rounded-2 lt-laptop-(gap-4 px-3 py-2)"
        v-for="(data, index) in datas"
      >
        <div class="i-palette:monitor w-11 h-12 lt-laptop-(w-9 h-9)"></div>
        <div class="text-7.5 lt-laptop-(text-6) font-700">
          {{ data.value }}
          <div class="text-(greyText 3) flex-center gap-2">
            {{ data.name }}数
            <div
              class="text-(#4DC591 3) flex-center"
              :class="{ 'text-#F94144': index === 1 }"
            >
              <div class="i-icons:caretdown w-4 h-4 rotate-180"></div>
              {{ data.percentage }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const datas = ref([
  { name: "在线", value: 32, percentage: 2.6 },
  { name: "离线", value: 0, percentage: 2.6 },
]);
</script>

<style scoped></style>
