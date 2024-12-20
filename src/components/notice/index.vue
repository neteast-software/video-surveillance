<template>
  <div class="w-1/2 bg-#4880FF rounded-4 h-1/2">
    <img src="../../assets/imgs/notice/linebg.png" alt="" class="absolute" />
    <img
      src="../../assets/imgs/notice/imgbg.png"
      alt=""
      class="absolute right-16"
    />
    <header class="px-7.5 h-20 text-(white 6) flex-(between y-center)">
      <div class="flex-y-center gap-2">
        <div class="i-icons:notice w-6 h-6"></div>
        告警通知
      </div>
      <div
        class="i-icons:close w-6 h-6 cursor-pointer"
        @click="emit('update:showModal', false)"
      ></div>
    </header>
    <div class="bg-white py-6 rounded-b-4">
      <div
        class="inline-flex gap-2 bg-#F9F9F9 p-1 mx-7.5 rounded-2 border-(1px solid #f0f0f2) mb-5"
      >
        <div
          v-for="data in alarmCategory"
          :key="data.value"
          @click="curCategory = data.value"
          :class="[
            'px-4 py-1 rounded-2 text-greyText cursor-pointer flex-center gap-1 transition',
            curCategory === data.value ? 'bg-#3563ef text-white' : '',
          ]"
        >
          <div
            class="w-5 h-5"
            :class="`i-icons:${getIconClass(data.value)}`"
          ></div>
          {{ data.category }}({{ data.num }})
        </div>
      </div>
      <NScrollbar class="px-7.5 !h-120 text-4">
        <div class="flex gap-5 mb-4" v-for="record in myList?.records">
          <img
            :src="record.img"
            class="w-45 h-30"
            alt=""
          />
          <div class="flex-col justify-between py-1 flex-w-rest">
            <div class="">
              <div class="text-4.5 font-600 truncate mb-1">
                {{ record.title }}
              </div>
              <div class="overflow-hidden content-ellipsis text-greyText">
                {{ record.content }}
              </div>
            </div>
            <div class="flex-between text-greyText">
              <div class="flex-center gap-3">
                <div class="text-(primary 3) px-2 bg-#E1EAF6 rounded-2px">
                  {{ record.typeLabel }}
                </div>

                <span class="text-greyText"
                  >来源设备：{{ record.deviceName }}</span
                >
              </div>
              <span class="text-lightGrey">{{ record.happenTime }}</span>
            </div>
          </div>
        </div>
      </NScrollbar>
      <footer class="flex-center mt-2 gap-5">
        <div>总数 {{ myList?.total }}</div>
        <NPagination
          :display-order="['size-picker', 'pages', 'quick-jumper']"
          v-model:page="pageNum"
          v-model:page-size="pageSize"
          :page-count="myList?.pages"
          show-quick-jumper
          show-size-picker
          :page-sizes="[1, 10, 20, 30, 50]"
        />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { NScrollbar, NPagination } from "naive-ui";
import { getMyList } from "@/utils/network/api/index";
import { MyList } from "@/utils/network/types";
import { useCommonDataStore } from "@/stores/index";
import { storeToRefs } from "pinia";
const CommonData = useCommonDataStore();
const { alarmCategory } = storeToRefs(CommonData);
const { getAlarmCategoryData } = CommonData;
interface Props {
  showModal: boolean;
}
const emit = defineEmits(["update:showModal"]);
withDefaults(defineProps<Props>(), {});
const curCategory = ref("");
const pageNum = ref(1);
const pageSize = ref(10);
const myList = ref<MyList>();
function getIconClass(value: string) {
  switch (value) {
    case "":
      return "all";
    case "1":
      return "quipwarn";
    default:
      return "defaultIcon";
  }
}
const myListParams = computed(() => ({
  pageSize: String(pageSize.value),
  pageNum: String(pageNum.value),
  ...(curCategory.value !== "" ? { category: curCategory.value } : {}),
}));

async function initData() {
  const { data } = await getMyList(myListParams.value);
  myList.value = data;
}
onMounted(() => {
  initData();
  getAlarmCategoryData();
});
watch(() => myListParams.value, initData);
</script>

<style scoped>
.content-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 控制显示的行数 */
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3rem; /* 根据字体大小调整高度以显示两行 */
}
:deep(
    .n-pagination .n-pagination-item:not(.n-pagination-item--disabled):hover
  ) {
  @apply text-primary;
}
</style>
