<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  backToday?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  backToday: false,
});
const emits = defineEmits(["backToday"]);

watch(
  () => props.backToday,
  () => {
    goToToday();
  }
);

// 初始化日期
const currentDate = ref(new Date()); // 当前日期
const activeDate = ref(new Date().getDate());
// 获取当前星期一的日期
function getMonday(d: Date) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 调整到上一周的周一
  return new Date(d.setDate(diff));
}

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
      label: day.toISOString().split("T")[0].split("-")[2], // 获取日期的“天”
      weekDay: ["日", "一", "二", "三", "四", "五", "六"][day.getDay()], // 获取日期的“星期”
    });
  }
  return week;
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
  activeDate.value = today.getDate();
  currentWeek.value = getCurrentWeek(currentDate.value);
  if (animatedElement.value) {
    animateCSS(animatedElement.value, "fadeIn");
  }
  emits("backToday", false);
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
        class="flex-(col y-center) bg-#F5F9FF cursor-pointer rounded-7.5 px-2.5 py-3 transition duration-500 hover:bg-primary/20"
        :class="{ active: activeDate === day.day.getDate() }"
        @click="activeDate = day.day.getDate()"
      >
        <div
          class="text-greyText"
          :class="{ 'text-white': activeDate === day.day.getDate() }"
        >
          {{ day.weekDay }}
        </div>
        <div class="w-full h-1px bg-greyLine my-2 lt-laptop-(my-1)"></div>
        <div class="text-5 font-700 rounded-full lt-laptop-(text-3.5)">
          <!-- :class="{ 'bg-primary': activeDate === day.day.getDate() }" -->
          {{ day.label }}
        </div>
      </div>
    </div>
    <!-- <NFloatButton :left="-16" shape="circle" @click="moveCalendar('prev')">
      <div class="i-common:small-arrow h-6 w-6 rotate-180 text-primary"></div>
    </NFloatButton>
    <NFloatButton :right="-16" shape="circle" @click="moveCalendar('next')">
      <div class="i-common:small-arrow h-6 w-6 text-primary"></div>
    </NFloatButton> -->
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
