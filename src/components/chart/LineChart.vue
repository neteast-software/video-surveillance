<template>
  <div>
    <Chart v-if="source.length" :option="(option as ECOption)"></Chart>
    <NEmpty v-else></NEmpty>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Chart from "./index.vue";
import type { ECOption } from "./index.vue";
import { NEmpty } from "naive-ui";
import { BaseChartProps, defaultGrid } from "./index";
import { LineSeriesOption } from "echarts/charts";
import { lineDefaultSeries } from "./index";
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts";
import useTheme from "@/utils/theme";
const { colorPrimary, colorBg, colorText } = useTheme();
const defaultXAxis: XAXisComponentOption = {
  type: "category",
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    fontSize: 10,
  },
  nameTextStyle: {
    fontSize: 10,
    padding: [0, 0, -20, -25],
    verticalAlign: "bottom",
    color: "#838EB6",
  },
};
const defaultYAxis: YAXisComponentOption = {
  type: "value",
  axisLabel: {
    fontSize: 10,
    align: "center",
    // padding: [0, 30, 0, 0]
  },
  nameTextStyle: {
    fontSize: 10,
    // padding: [0, 50, 0, 0],
    color: "#838EB6",
  },
  splitLine: {
    lineStyle: {
      color: ["rgba(85, 110, 153, 0.08)"],
      width: 0.5,
    },
  },
};
const defaultLegend: LegendComponentOption = {
  icon: "circle",
  bottom: 10,
  itemGap: 10,
  itemWidth: 8,
  itemHeight: 8,
  textStyle: {
    fontSize: 10,
  },
};
const defaultTooltip = computed<TooltipComponentOption>(() => {
  return {
    show: true,
    trigger: "axis",
    backgroundColor: colorBg.value,
    textStyle: {
      color: colorText.value,
    },
  };
});
const defaultColors = computed(() => {
  return ["#2D9CDB", "#4DC591", "#FF7648", "#F94144"];
});
interface Props extends BaseChartProps {
  xAxis?: XAXisComponentOption;
  yAxis?: YAXisComponentOption;
  legend?: LegendComponentOption;
  tooltip?: TooltipComponentOption;
  color?: string[] | string;
  series?: LineSeriesOption | LineSeriesOption[];
  grid?: GridComponentOption;
}

const props = withDefaults(defineProps<Props>(), {
  color: () => [],
});
// <ECOption>
const option = computed(() => {
  const {
    xAxisName,
    yAxisName,
    source,
    xAxis,
    yAxis,
    legend,
    tooltip,
    color,
    series,
    grid,
  } = props;
  if (source.length < 1) return {};
  const finalSeries = series
    ? Array.isArray(series)
      ? series
      : { ...lineDefaultSeries, ...series }
    : lineDefaultSeries;
  return {
    grid: { ...defaultGrid, ...grid },
    dataset: {
      source,
    },
    xAxis: {
      ...defaultXAxis,
      ...xAxis,
      name: xAxisName,
    },
    yAxis: {
      ...defaultYAxis,
      ...yAxis,
      name: yAxisName,
    },
    color: color.length ? color : defaultColors.value,
    series: Array.isArray(finalSeries)
      ? finalSeries
      : new Array(source.length - 1).fill(finalSeries),
    legend: {
      ...defaultLegend,
      ...legend,
    },
    tooltip: {
      ...defaultTooltip.value,
      ...tooltip,
    },
  };
});
</script>

<style scoped></style>
