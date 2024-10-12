<template>
  <div class="w-full h-full" ref="chart"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as echarts from "echarts/core";
import type { ComposeOption } from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import {
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  RadarChart,
  ScatterChart,
} from "echarts/charts";
import type {
  LineSeriesOption,
  BarSeriesOption,
  PieSeriesOption,
  GaugeSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption,
} from "echarts/charts";

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
} from "echarts/components";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption,
  DatasetComponentOption,
  DataZoomComponentOption,
} from "echarts/components";

// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
import { onMounted } from "vue";
import { nextTick } from "vue";
import { watch } from "vue";
import { onBeforeUnmount } from "vue";
import { useResizeObserver, useDebounceFn } from "@vueuse/core";
// import { isDark } from '../theme';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  RadarChart,
  ScatterChart,
]);

export type ECOption = ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | PieSeriesOption
  | GaugeSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DatasetComponentOption
  | RadarSeriesOption
  | ScatterSeriesOption
  | DataZoomComponentOption
>;
const props = defineProps<{
  option: ECOption;
}>();

const chart = ref<HTMLElement>();
let echartsInstance: echarts.ECharts | null = null;
watch(() => props.option, updateChart, { deep: true });
function onResize() {
  if (!echartsInstance) return;
  echartsInstance.resize();
}
function destroyChart() {
  echartsInstance?.dispose();
  echartsInstance = null;
}

function updateChart(option: ECOption) {
  if (!echartsInstance) return;
  echartsInstance.setOption({
    backgroundColor: "transparent",
    ...option,
  });
}
function renderChart() {
  echartsInstance = echarts.init(chart.value!);
  updateChart(props.option);
}
// resize防抖
const resizeDebounce = useDebounceFn(onResize, 50);
useResizeObserver(chart, resizeDebounce);
onMounted(async () => {
  await nextTick();
  renderChart();
});
onBeforeUnmount(() => {
  destroyChart();
});
</script>

<style scoped></style>
