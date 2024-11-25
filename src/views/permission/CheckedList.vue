<template>
  <div class="border-l pt-8 pl-9 h-full flex flex-col w-132">
    <h3 class="mb-8 text-info">已选择列表</h3>
    <NScrollbar class="h-0 flex-1 pr-24">
      <ul class="flex flex-col-reverse">
        <template v-for="item in list" :key="item[keyField]">
          <li v-motion-slide-right class="flex items-center py-2" v-if="item">
            <span class="w-0 flex-1 truncate">{{ item[labelField] }}</span>
            <span class="mx-5">{{ item[parentLabelField] }}</span>
            <NButton
              type="warning"
              quaternary
              size="tiny"
              @click="$emit('delete', item[keyField])"
            >
              <Icon :icon="PlusIcon" class="rotate-45"></Icon>
            </NButton>
          </li>
        </template>
      </ul>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import { NScrollbar, NButton } from "naive-ui";
import { Icon } from "@iconify/vue";
// import PlusIcon from '@ebuild/icons/plus';
interface Props {
  parentLabelField?: string;
  keyField: string;
  labelField?: string;
  list: Record<string, any>[];
}
withDefaults(defineProps<Props>(), {
  keyField: "id",
  labelField: "label",
  parentLabelField: "parentName",
});
defineEmits(["delete"]);
</script>

<style scoped></style>
