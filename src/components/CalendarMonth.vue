<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getMonday, getFirstDayOfMonth } from "@/utils/other/calendar";

interface Props {
  backToday?: boolean;
  timestamp?: number;
  events?: Array<{ date: string; offlineAlarm: string }>;
}
const props = withDefaults(defineProps<Props>(), {
  backToday: false,
});
const emits = defineEmits(["backToday", "update:timestamp"]);

watch(
  () => props.backToday,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      goToToday();
    }
  }
);

const currentDate = ref(new Date());
const activeDate = ref(new Date().getDate());

// 生成当前一个月的日期数组
const currentMonth = ref(getCurrentMonth(currentDate.value));
function getCurrentMonth(date: Date) {
  const firstDay = getFirstDayOfMonth(date);
  const month = [];
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  for (let i = 0; i < daysInMonth; i++) {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + i);
    month.push({
      day,
      label: String(day.getDate()), // 确保两位数格式
      weekDay: ["日", "一", "二", "三", "四", "五", "六"][day.getDay()],
    });
  }
  return month;
}
function clickActiveDay(day: { day: Date }) {
  // const today = new Date();
  // if (day.day > today) return message.warning("不能选择未来日期");
  activeDate.value = day.day.getDate();
  currentDate.value = day.day;
  emits("update:timestamp", day.day.getTime());
}

const animatedElement = ref<HTMLElement | null>(null);
// 回到今日
function goToToday() {
  const today = new Date();
  currentDate.value = today;
  emits("update:timestamp", today.getTime());
  activeDate.value = today.getDate();
  currentMonth.value = getCurrentMonth(currentDate.value);
  if (animatedElement.value) {
    animateCSS(animatedElement.value, "fadeIn");
  }
  emits("backToday", false);
}
// 更新当前日期和星期
function updateActiveDateAndWeek(date: Date) {
  activeDate.value = date.getDate();
  // 判断新日期是否在当前显示周内
  const mondayOfCurrentWeek = getMonday(currentDate.value);
  const sundayOfCurrentWeek = new Date(mondayOfCurrentWeek);
  sundayOfCurrentWeek.setDate(mondayOfCurrentWeek.getDate() + 6);

  if (date < mondayOfCurrentWeek || date > sundayOfCurrentWeek) {
    // 新日期不在当前月份，切换到新月份
    currentDate.value = date;
    currentMonth.value = getCurrentMonth(date);
  }
}

watch(
  () => props.timestamp,
  (newTimestamp) => {
    if (newTimestamp) {
      const newDate = new Date(newTimestamp);
      activeDate.value = newDate.getDate();
      currentDate.value = newDate;
      currentMonth.value = getCurrentMonth(newDate);
    }
  }
);

// 计算某一天的事件数量
function getEventColors(day: string) {
  if (!props.events) return [];
  const event = props.events.find((event) => event.date.split("-")[2] === day);
  if (!event) return [];
  const colors = [];
  if (event.offlineAlarm) colors.push("bg-info");
  // if (event.onlineAlarm) colors.push("bg-success");
  return colors;
}

// animate.css动画
function animateCSS(
  element: HTMLElement,
  animation: string,
  prefix = "animate__"
) {
  return new Promise((resolve) => {
    const animationName = `${prefix}${animation}`;
    element.classList.add(`${prefix}animated`, animationName);
    function handleAnimationEnd(event: AnimationEvent) {
      event.stopPropagation();
      element.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }
    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });
}
//横向滚动
const calendarContainer = ref<HTMLElement | null>(null);
const handleWheel = (
  content: HTMLElement | null,
  scrollContainer: HTMLElement | null,
  event: WheelEvent
) => {
  if (scrollContainer && content) {
    if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
      event.preventDefault();
      const delta = event.deltaY || event.deltaX || event.deltaZ;
      scrollContainer.scrollLeft += delta;
    }
  }
};
</script>

<template>
  <div
    class="relative w-full rounded-1 py-3 z-99 overflow-x-auto main"
    ref="calendarContainer"
    @wheel="handleWheel(animatedElement, calendarContainer, $event)"
    style="overflow-x: scroll"
  >
    <div ref="animatedElement" class="flex-between gap-2.5 whitespace-nowrap">
      <div
        v-for="day in currentMonth"
        :key="day.label"
        class="flex-(col y-center) bg-#F5F9FF cursor-pointer rounded-7.5 pt-2 pb-1.5 px-2 lt-laptop-(px-1.5 pt-1.5 pb-1) transition duration-500 hover:bg-primary/20"
        @click="clickActiveDay(day)"
        :class="{ 'bg-primary/20': activeDate === day.day.getDate() }"
      >
        <div class="text-greyText">
          <!-- :class="{ 'text-white': activeDate === day.day.getDate() }" -->
          {{ day.weekDay }}
        </div>
        <div class="w-full h-1px bg-greyLine my-2 lt-laptop-(my-1)"></div>
        <div
          class="text-5 font-700 rounded-full lt-laptop-(text-3.5) w-8 flex-center lt-laptop-(w-6) transition"
          :class="{ active: activeDate === day.day.getDate() }"
        >
          {{ day.label }}
        </div>
        <div class="mt-2px flex gap-2px h-1">
          <div
            v-for="dotColor in getEventColors(day.label)"
            :key="dotColor"
            :class="dotColor"
            class="w-1 h-1 rounded-full"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-float-button) {
  @apply !absolute top-1/2 -translate-y-1/2 !s-8 !min-h-8 z-2;
}
.active {
  @apply bg-primary text-white;
}

.main:hover::-webkit-scrollbar-thumb {
  background: #bfbfbf;
}
</style>
