<template>
  <Transition appear name="slideLeft">
    <div class="flex-col gap-4 h-full w-24% min-w-102 lt-laptop-(min-w-92)">
      <header class="bg-white w-full rounded-2px py-6">
        <div class="mx-6 flex justify-between lt-laptop-(mx-3)">
          <div v-for="data in options" class="flex-center">
            <img :src="data.icon" alt="" class="w-7 h-7 lt-laptop-(w-7 h-7)" />
            <div class="ml-2 tracking-normal lt-laptop-(text-3)">
              {{ data.label }}
              <div
                class="text-6 font-700 leading-7.5 mt-1 overflow-hidden lt-laptop-(text-6)"
              >
                {{ data.value }}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div
        class="w-full flex-col flex-h-rest bg-white rounded-2px py-7.5 lt-laptop-(p-5) relative"
      >
        <img
          src="../../assets/imgs/deviceListBg.png"
          class="absolute right-0 top-0 h-37 z-0"
        />
        <header class="text-4.5 flex-y-center font-600 mb-4 px-7.5 z-1">
          <div class="w-1 h-4 bg-primary rounded-2px mr-2"></div>
          设备列表
        </header>
        <NTabs
          animated
          v-model:value="tabCache"
          :tabs-padding="30"
          class="flex-h-rest"
        >
          <n-tab-pane
            v-for="option in menuOptions"
            :name="option.key"
            :tab="option.label"
            class="h-full"
          >
            <div class="fill-parent relative">
              <NScrollbar class="px-7.5">
                <div
                  v-for="data in dataList"
                  class="bg-primaryLightBg rounded-1 p-5 flex gap-4 mb-5 transition duration-300 border-(2 white/0 solid) lt-laptop-(p-3)"
                  @click="clickList = data.id"
                  :class="{ active: clickList === data.id }"
                >
                  <img
                    src="../../assets/imgs/text/listImg.png"
                    class="w-22 h-22 rounded-1 lt-laptop-(w-20 h-20)"
                    alt=""
                  />
                  <div class="flex-w-rest flex-col justify-between">
                    <div class="flex-between">
                      <div class="text-4 text-basic">{{ data.name }}</div>
                      <span class="text-lightGrey">{{ data.type }}</span>
                    </div>
                    <div class="flex-between text-#8A92A6 h-11">
                      <div class="flex-col flex-center">
                        <div class="text-(basic 4) font-700 flex-center">
                          {{ data.onlineTime }}
                        </div>
                        在线时长
                      </div>
                      <div class="flex-col flex-center">
                        <div
                          class="text-(basic 4) font-700 flex-center lt-laptop-(text-4)"
                        >
                          {{ data.resolution }}
                        </div>
                        分辨率
                      </div>
                      <div class="flex-(col center) gap-2">
                        <NTag
                          :bordered="false"
                          size="small"
                          :type="FilterStatus(data.status)"
                        >
                          {{ data.status }}
                        </NTag>

                        设备状态
                      </div>
                    </div>
                  </div>
                </div>
              </NScrollbar>
            </div>
          </n-tab-pane>
        </NTabs>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  NSelect,
  NInput,
  NTag,
  NTabs,
  NTabPane,
  NPopselect,
  NMenu,
  NScrollbar,
} from "naive-ui";
import { menuOptions, options, selectDatas, dataList } from "./data";
const tabCache = ref(1); // tab选中值
const clickList = ref(1); // 点击列表项

function FilterStatus(status: string) {
  switch (status) {
    case "正常":
      return "primary";
    case "在线":
      return "success";
    case "离线":
      return "info";
    case "故障":
      return "warning";
    default:
      return "info";
  }
}
</script>

<style scoped>
/* input::placeholder {
  color: #cccccc;
} */
:deep(.n-tabs-tab__label) {
  @apply text-4 
  /* font-weight: 600; */;
}
:deep(.n-tabs-bar) {
  display: none;
}
:deep(.n-tabs .n-tabs-tab-pad) {
  @apply lt-laptop-(w-6);
}
.active {
  /* background: linear-gradient(0deg, #e3eeff, #e3eeff), #f5f9ff; */
  border: 2px solid #3563ef;
}
</style>
