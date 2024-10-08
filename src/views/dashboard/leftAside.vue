<template>
  <div class="min-w-125 flex-col gap-4 h-full">
    <header class="bg-white w-full rounded-1 pt-6 pb-2.5">
      <div class="mx-6 flex justify-between">
        <div v-for="data in options" class="flex-center w-1/4">
          <img :src="data.icon" alt="" class="w-8 h-8" />
          <div class="ml-3 text-4 tracking-normal flex-w-rest">
            {{ data.label }}
            <div class="text-7 font-700 leading-7.5 mt-1 overflow-hidden">
              {{ data.value }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-1px mt-6 mb-2.5 bg-greyLine"></div>
      <div class="mx-6 flex">
        <NPopselect
          v-model:value="selectValue"
          :options="selectDatas"
          trigger="click"
        >
          <div
            class="min-w-25 flex-center gap-2"
            @click="selectState = !selectState"
          >
            {{ selectValue }}
            <div
              class="i-icons:arrow w-4 h-4 text-lightGrey transition"
              :class="selectState ? 'rotate-180' : ''"
            ></div>
          </div>
        </NPopselect>
        <div class="h-8 w-2px bg-greyLine mx-6"></div>
        <NInput placeholder="请输入关键词搜索">
          <template #prefix>
            <div class="i-icons:search w-5 h-5"></div>
          </template>
        </NInput>
      </div>
    </header>
    <div
      v-show="showList"
      class="w-full flex-col flex-h-rest bg-white rounded-1 p-7.5"
    >
      <header class="flex justify-between mb-6">
        <div class="text-4.5 flex-center font-500">
          <div class="w-1 h-4 bg-primary rounded-2px mr-2"></div>
          设备列表
        </div>
        <div
          class="i-icons:close w-6 h-6 text-lightGrey"
          @click="showList = false"
        ></div>
      </header>
      <div class="flex">
        <NMenu
          v-model:value="activeKey"
          mode="horizontal"
          :options="menuOptions"
          class="text-4.5"
        />
        <NSelect
          v-model:value="selectlist"
          :options="options"
          class="w-32 text-4"
        ></NSelect>
      </div>
      <div class="w-full flex-h-rest relative">
        <img
          v-if="dataList.length === 0"
          src="../../assets/imgs/defaultImg.png"
          class="w-75 h-75 absolute left-1/2 -translate-x-1/2 mt-12"
          alt=""
        />
        <NScrollbar trigger="none" v-else>
          <div
            v-for="data in dataList"
            class="bg-#F5F9FF rounded-1 p-5 flex gap-4 mb-5"
          >
            <img
              src="../../assets/imgs/text/listImg.png"
              class="w-25 h-25 rounded-1"
              alt=""
            />
            <div class="flex-w-rest flex-col justify-between">
              <div class="flex-between">
                <div class="text-4.5">{{ data.name }}</div>
                <span class="text-lightGrey">{{ data.type }}</span>
              </div>
              <div class="flex-between text-#8A92A6 h-11">
                <div class="flex-col flex-center">
                  <div class="text-(basic 4.5) font-700 flex-center">
                    {{ data.onlineTime }}
                  </div>
                  在线时长
                </div>
                <div class="flex-col flex-center">
                  <div class="text-(basic 4.5) font-700 flex-center">
                    {{ data.resolution }}
                  </div>
                  分辨率
                </div>
                <div class="flex-(col center)">
                  <div class="w-11 h-5 bg-#FFF0D4 text-#FF7648 flex-center">
                    {{ data.status }}
                  </div>
                  设备状态
                </div>
              </div>
            </div>
          </div>
        </NScrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NSelect, NInput, NPopselect, NMenu, NScrollbar } from "naive-ui";
import { menuOptions, options, selectDatas, dataList } from "./data";
const selectValue = ref("设备事件");
const selectlist = ref();
const selectState = ref(false);
const activeKey = ref(1);
const showList = ref(true);
</script>

<style scoped>
:deep(.n-input) {
  border: none;
}
:deep(
    .n-menu.n-menu--horizontal
      .n-menu-item-content:not(.n-menu-item-content--disabled):hover
      .n-menu-item-content-header
  ) {
  color: #3563ef;
}
</style>
