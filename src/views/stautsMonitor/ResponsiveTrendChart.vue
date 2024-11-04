<template>
  <div class="flex-col gap-2 relative h-full justify-between">
    <div class="flex justify-between space-y-4">
      <div class="flex gap-2">
        <button
          v-for="range in timeRanges"
          :key="range.id"
          @click="activeRange = range.id"
          class="px-4 py-1.5 rounded-md text-(greyText 4) transition lt-laptop-(px-3 py-1px text-3 h-6)"
          :class="
            activeRange === range.id ? 'bg-#3563ef text-white' : 'bg-#F5F9FF '
          "
        >
          <!-- border-(1px solid #eaeaea) -->
          {{ range.name }}
        </button>
      </div>
      <!-- <div class="absolute left-30 top-20 w-30 h-20 frosted z-9999">111</div> -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span
          v-for="(range, index) in colorRanges"
          :key="index"
          class="flex items-center"
        >
          <span
            :class="['w-3 h-3 inline-block mr-1 rounded']"
            :style="{
              background: getColorClass(range.max),
            }"
          ></span>
          <span class="text-[#232d42]">{{ range.min }}-{{ range.max }}</span>
        </span>
      </div>
    </div>
    <main class="flex-col">
      <div class="grid grid-cols gap-7px mb-2 lt-laptop-(gap-5px)">
        <div
          v-for="month in selectType === 1
            ? months.firsthalf
            : months.secondhalf"
          :key="`month-${month}`"
          class="contents"
        >
          <div class="text-right pr-2 text-greyText min-w-10">
            {{ month }}月
          </div>
          <div
            v-for="day in 31"
            :key="`${month}-${day}`"
            class="relative group"
          >
            <NPopover
              trigger="hover"
              placement="bottom-start"
              :show-arrow="false"
              style="
                padding: 0px;
                background-color: transparent;
                border-radius: 6px;
              "
            >
              <template #trigger>
                <div
                  class="w-full pb-[100%] rounded hover:scale-110 cursor-pointer"
                  :style="{
                    background: getColorClass(getAlarmCount(month, day)),
                  }"
                ></div>
              </template>
              <div class="w-40 text-3 frosted p-2">
                <div class="text-#1D2129 mb-1">
                  {{ currentYear }}-{{ month }}-{{ day }}
                </div>
                <div
                  class="p-1.5 bg-white rounded-1 flex-between gap-10 w-full"
                >
                  <span class="text-greyText">在线数量</span>
                  {{ getAlarmCount(month, day) }}
                </div>
              </div>
            </NPopover>
          </div>
        </div>
      </div>
      <div class="grid grid-cols gap-1">
        <div class="text-right pr-10"></div>
        <div
          v-for="day in 31"
          :key="`day-${day}`"
          class="text-xs text-center text-greyText"
        >
          {{ String(day).padStart(2, "0") }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { NPopover } from "naive-ui";
import { getAlarmTrend } from "@/utils/network/api/statusMonitor";
import type { AlarmTrend } from "@/utils/network/types/statusMonitor";
interface Props {
  selectType?: string;
}
const props = withDefaults(defineProps<Props>(), {
  selectType: "0",
});

const activeRange = ref(0);
const currentDate = ref(new Date()); // 当前日期
const currentYear = currentDate.value.getFullYear(); // 当前年份
const alarmTrendData = ref<AlarmTrend[]>([]);
async function initdata() {
  const { data } = await getAlarmTrend(props.selectType, activeRange.value);
  alarmTrendData.value = data;
}
onMounted(initdata);
const timeRanges = [
  { id: 0, name: "全部" },
  { id: 1, name: "离线次数" },
];
const colorRanges = [
  { min: 0, max: 100 },
  { min: 100, max: 200 },
  { min: 200, max: 300 },
  { min: 300, max: 5000 },
  { min: 500, max: 1000 },
];

const months = {
  firsthalf: [6, 5, 4, 3, 2, 1], // 前半年
  secondhalf: [12, 11, 10, 9, 8, 7], // 后半年
};

const getColorClass = (value: number) => {
  if (value === 0) return "rgba(53,99,239, 0.05)";
  if (value <= 100) return "rgba(53,99,239, 0.2)";
  if (value <= 200) return "rgba(53,99,239, 0.3)";
  if (value <= 300) return "rgba(53,99,239, 0.45)";
  if (value <= 5000) return "rgba(53,99,239, 0.6)";
  return "rgba(53,99,239, 0.05)";
};

watch([() => props.selectType, activeRange], initdata);

// 获取指定日期的 alarmCount
function getAlarmCount(month: number, day: number) {
  const dateStr = `${currentYear}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  const entry = alarmTrendData.value.find((item) => item.date === dateStr);
  return entry ? entry.alarmCount : 0;
}
</script>

<style scoped>
.grid-cols {
  grid-template-columns: auto repeat(31, minmax(0, 1fr));
}

.frosted {
  /* background: transparent; */
  background: linear-gradient(
    300deg,
    rgba(236, 247, 255, 0.1) -3%,
    rgba(247, 251, 255, 0.1) 83%
  );
  box-sizing: border-box;
  border: 1px solid #fff;
  /* border-image: linear-gradient(317deg, #ffffff 8%, rgba(255, 255, 255, 0) 78%)
    1; */
  backdrop-filter: blur(10px);
  border-radius: 6px;
}
</style>
