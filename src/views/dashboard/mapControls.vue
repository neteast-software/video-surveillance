<template>
  <div class="text-basic">
    <div class="button hover:scale-106">
      <div class="i-icons:settings icon"></div>
    </div>
    <div class="button my-3 hover:scale-106">
      <div class="i-icons:refresh icon"></div>
    </div>
    <div class="button flex-(col center) gap-1">
      <div class="i-icons:add icon"></div>
      <NSlider :default-value="77" style="height: 240px" vertical />
      <div class="i-icons:reduce icon"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSlider } from "naive-ui";
</script>

<style scoped>
.button {
  @apply p-2 bg-white rounded-1 cursor-pointer transition;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
