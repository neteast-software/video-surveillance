<script setup lang="ts">
import { ref, watch } from "vue";
import { getMonday } from "@/utils/other/calendar";

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

const currentDate = ref(new Date()); // 当前日期
// 初始化日期
const activeDate = ref(new Date().getDate());

// 生成当前一周的日期数组
const currentWeek = ref(getCurrentWeek(currentDate.value));
function getCurrentWeek(date: Date) {
  const monday = getMonday(date);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push({
      day,
      label: String(day.getDate()).padStart(2, "0"), // 确保 label 是两位数
      weekDay: ["日", "一", "二", "三", "四", "五", "六"][day.getDay()], // 获取日期的“星期”
    });
  }
  return week;
}
function clickActiveDay(day: { day: Date }) {
  // const today = new Date();
  // if (day.day > today) return message.warning("不能选择未来日期");
  activeDate.value = day.day.getDate();
  currentDate.value = day.day;
  emits("update:timestamp", day.day.getTime());
}

const animatedElement = ref<HTMLElement>();
function moveCalendar(direction: "prev" | "next") {
  if (animatedElement.value) {
    animateCSS(animatedElement.value, "fadeIn");
  }
  const offset = direction === "prev" ? -7 : 7;
  const newDate = new Date(currentDate.value);
  newDate.setDate(currentDate.value.getDate() + offset);
  currentDate.value = newDate;
  currentWeek.value = getCurrentWeek(currentDate.value);
}
// 回到今日
function goToToday() {
  const today = new Date();
  currentDate.value = today;
  emits("update:timestamp", today.getTime());
  activeDate.value = today.getDate();
  currentWeek.value = getCurrentWeek(currentDate.value);
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
    // 新日期不在当前周，切换到新周
    currentDate.value = date;
    currentWeek.value = getCurrentWeek(date);
  }
}

watch(
  () => props.timestamp,
  (newTimestamp) => {
    if (newTimestamp) {
      const newDate = new Date(newTimestamp);
      updateActiveDateAndWeek(newDate); // 更新 activeDate 和当前周
    }
  }
);

// 标记点计算：计算某天的事件数量
function hasEvents(day: string) {
  if (!props.events) return false;
  return props.events.some((event) => event.date.split("-")[2] === day);
}

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
</script>

<template>
  <div class="relative w-full rounded-1 p-3 lt-laptop-(px-0)">
    <div ref="animatedElement" class="flex-between">
      <div
        v-for="day in currentWeek"
        :key="day.label"
        class="flex-(col y-center) bg-#F5F9FF cursor-pointer rounded-7.5 py-3 px-1.5 transition duration-500 hover:bg-primary/20"
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
        <div class="mt-2px flex gap-2px" v-if="hasEvents(day.label)">
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
</style>
