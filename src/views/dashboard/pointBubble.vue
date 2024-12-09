<template>
  <div
    v-if="bubbleVisible"
    class="absolute h-100 w-100"
    :style="{
      top: `${bubblePosition[1] - 480}px`,
      left: `${bubblePosition[0] - (isSmallScreen ? 268 : 315)}px`,
    }"
  >
    <!-- <div v-if="!curData.type">111</div> -->

    <div
      class="transition bg-white bg rounded-1 p-7.5 text-4 absolute bottom-0 left-0 lt-laptop-(p-4)"
      v-if="curData.type != '0'"
    >
      <header class="flex-y-center gap-3 mb-4 text-4.5 lt-laptop-(text-4 mb-3)">
        <div class="font-600 flex-center">
          <div class="w-1 h-4 bg-primary rounded-2px mr-2"></div>
          {{ curData.name }}
        </div>
        <NTag
          :bordered="false"
          size="small"
          :type="FilterStatus(curData.status)"
        >
          {{ curData.status }}
        </NTag>
      </header>
      <section class="mb-7 lt-laptop-(mb-5)">
        <!-- <div class="flex gap-2.5">
          <div class="i-icons:position w-5 h-5 text-greyText mt-1"></div>
          <div>
            <div class="text-4.5 lt-laptop-(text-4)">
              {{ curData.manufacturer }}
            </div>
            <span class="text-lightGrey lt-laptop-(text-3.5)">{{
              curData.address
            }}</span>
          </div>
        </div> -->
        <div class="relative flex text-14px mb-1">
          <div class="mr-6 whitespace-nowrap">
            负责人: {{ curData.responsible || "--" }}
          </div>
          <div class="whitespace-nowrap">
            设备编号: {{ curData.serialNo || "--" }}
          </div>
          <img
            src="../../assets/imgs/cardImg.png"
            alt=""
            class="absolute w-80px h-80px -right-16px -top-60px lt-laptop-(-top-50px)"
          />
        </div>
        <!-- absolute -top-38 left-0 -->
        <div
          v-if="curData.type === '2' && curData.nvrId"
          class="relative h-46 w-full bg-white p-1 rounded-2 lt-laptop-( h-38 )"
        >
          <Monitor
            @click="navigateToFullscreenPage(curData.id)"
            :id="String(curData.id)"
            :nvr-id="curData.nvrId!"
            :nvr-name="curData.name"
            :channel-id="curData.id"
            :ch-name="curData.name"
            :channel-num="0"
          >
          </Monitor>
          <div
            @click="navigateToFullscreenPage(curData.id)"
            class="i-icons:navigate w-5 h-5 text-white absolute bottom-2 cursor-pointer right-2"
          ></div>
        </div>
        <div class="bg-#F4F8FF p-3 mt-4 flex gap-3 lt-laptop-(p-2)">
          <img
            src="../../assets/imgs/text/listImg.png"
            class="w-14 h-14"
            alt=""
          />
          <div class="text-#A0AEC0 list-desc w-60 lt-laptop-(w-55 text-3.5)">
            {{ curData.alarmInfo ? curData.alarmInfo.title : "暂无预警信息" }}
          </div>
        </div>
      </section>
      <footer
        class="flex items-center justify-around text-(4.5 primary) lt-laptop-(text-4)"
      >
        <!-- @click="handleGotoAlarmList" -->
        <div
          class="flex-center gap-2 cursor-pointer"
          @click="showAlarmList(curData.id)"
        >
          <div class="i-icons:event w-5 h-5"></div>
          预警台账
        </div>
        <div class="w-1px h-6 bg-greyLine"></div>
        <div
          class="flex-center gap-2 cursor-pointer"
          @click="showDeviceDetail(curData.id)"
        >
          <div class="i-icons:trend w-5 h-5"></div>
          设备详情
        </div>
      </footer>
    </div>
    <div
      class="transition bg-white bg rounded-1 p-7.5 text-4 absolute bottom-0 left-0"
      v-else
    >
      <header class="flex-y-center text-4.5 font-500 gap-2">
        <div class="i-icons:key-projects w-5 h-5 text-primary"></div>
        高架桥名称
      </header>
      <img
        src="../../assets/imgs/bridge.png"
        class="absolute top-0 right-0"
        alt=""
      />
      <p>
        新路呈东西走向，长500米，宽12米，为双向2车道。面对从福马路至道路最高点近20米的高差，加上高填方路段紧邻市委党校新校区和新建河道，道路与深基坑同步施工，如何护好施工安全，成为现场的重中之重课题。
      </p>
    </div>

    <!-- <div class="transition" v-else>
      <header class="flex-y-center text-4.5 font-600 mb-5">
        <div class="w-1 h-4 bg-primary rounded-2px mr-2"></div>
        重点工程
      </header>
      <section class="relative">
        <div class="flex text-greyText mb-3" v-for="project in keyProject">
          {{ project.name }}
          <div
            v-if="project.key === 'name'"
            class="flex-center text-basic gap-2"
          >
            {{ project.value }}
            <NTag :bordered="false" size="small" type="success">在线</NTag>
          </div>
          <div v-else-if="project.key === 'state'">
            <NRate readonly :default-value="Number(project.value)" />
          </div>
          <div v-else class="text-basic flex-w-rest">
            {{ project.value }}
            <div v-if="project.desc" class="text-(greyText 3.5) truncate">
              {{ project.desc }}
            </div>
          </div>
        </div>
        <img
          src="../../assets/imgs/cardImg.png"
          alt=""
          class="absolute right-5 bottom-0"
        />
      </section>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { bubblePosition, bubbleVisible } from "@/utils/map/mark";
import { NTag, NRate } from "naive-ui";
import { FilterStatus } from "@/utils/other/data";
import { useRouter } from "vue-router";
import { useMapInfoStore } from "@/stores/mapInfo";
import { storeToRefs } from "pinia";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { computed, ref, watch, nextTick } from "vue";
import Monitor from "@/views/index/Monitor.vue";
const mapInfo = useMapInfoStore();
const { curDetailId, alarmCurDetailId } = storeToRefs(mapInfo);
const deviceInfo = useDeviceInfoStore();
const { dataList, curdeviceListId } = storeToRefs(deviceInfo);
watch(bubbleVisible, () => {
  if (!bubbleVisible.value) {
    curDetailId.value = 0;
    alarmCurDetailId.value = 0;
  }
});
defineProps({
  visible: Boolean,
  position: {
    type: Array,
    default: () => [0, 0], // 弹窗的初始位置
  },
});
function showDeviceDetail(id) {
  if (alarmCurDetailId.value === 0) {
    curDetailId.value = id;
  } else {
    alarmCurDetailId.value = 0;
    setTimeout(() => {
      curDetailId.value = id;
    }, 300);
  }
}
function showAlarmList(id) {
  if (curDetailId.value === 0) {
    alarmCurDetailId.value = id;
  } else {
    curDetailId.value = 0;
    setTimeout(() => {
      alarmCurDetailId.value = id;
    }, 300);
  }
}
const router = useRouter();
// const showDetail = ref(true); // 是否是重点工程
function navigateToFullscreenPage(deviceId = 1) {
  router.push({
    name: "index", // 在 router 配置中定义的路由名称
    query: {
      deviceId,
    },
  });
}
//筛选dataList中对应curdeviceListId的数据
const curData = computed(() => {
  return dataList.value.filter((item) => item.id == curdeviceListId.value)[0];
});
const isSmallScreen = computed(() => window.innerWidth < 1540);

function handleGotoAlarmList() {
  //   router.push({
  //     name: "alarmList",
  //     query: {
  //       deviceName: curData.value.name || "",
  //     },
  //   });
}
// const keyProject = ref([
//   { key: "name", name: "项目名称：", value: "双园道路监控探头" },
//   { key: "time", name: "施工时间：", value: "2021-10-10 12：12：12" },
//   {
//     key: "location",
//     name: "工程位置：",
//     value: "福建黄金集团有限公司",
//     desc: "福建省福州市鼓楼区鼓东街道道山西路中段96号",
//   },
//   { key: "staff", name: "负责人员：", value: "张三三" },
//   { key: "num", name: "项目编号：", value: "23456789" },
//   { key: "state", name: "运行情况：", value: 4 },
// ]);
</script>

<style scoped>
.bg::after {
  content: "";
  position: absolute;
  bottom: -14px;
  left: 75%;
  width: 0;
  height: 0;
  border-top: 15px solid rgb(255, 255, 255);
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  z-index: 1;
}
</style>
