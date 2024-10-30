<template>
  <Chart v-if="source.length" :option="(option as ECOption)"></Chart>
  <NEmpty v-else></NEmpty>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Chart from "./index.vue";
import type { ECOption } from "./index.vue";
import { NEmpty } from "naive-ui";
// import { PieSeriesOption } from 'echarts/charts';
import useTheme from "@/utils/theme";
import {
  GridComponentOption,
  LegendComponentOption,
  PieSeriesOption,
  TooltipComponentOption,
} from "echarts";
import { DatasetSource } from "./index";
export type PieSource = DatasetSource | { name: string; value: number }[];
export type { PieSeriesOption } from "echarts/charts";
const { colorPrimary, colorBg, colorText } = useTheme();
const defaultLegend: LegendComponentOption = {
  icon: "emptyCircle",
  bottom: 0,
  itemGap: 40,
  itemWidth: 16,
  itemHeight: 16,
  textStyle: {
    fontSize: 14,
  },
  formatter: function (params: string) {
    const value = props.source.find((item) => item.name === params)?.value;
    return `${params}   ${value}个`;
  },
};
interface PieChartProps {
  series?: PieSeriesOption[] | Partial<PieSeriesOption>;
  seriesOption?: Partial<PieSeriesOption>;
  source: PieSource;
  color?: string[];
  legend?: LegendComponentOption;
  grid?: GridComponentOption;
  tooltip?: TooltipComponentOption;
}
const defaultColors = computed(() => {
  return [colorPrimary.value, "#DDE5DD"];
});
const props = withDefaults(defineProps<PieChartProps>(), {
  color: () => ["#3563EF", "#FF7648"],
  source: () => [],
});

const defaultTooltip = computed<TooltipComponentOption>(() => {
  return {
    show: true,
    trigger: "item",
    backgroundColor: colorBg.value,
    textStyle: {
      color: colorText.value,
    },
  };
});

const defaultOption = computed<PieSeriesOption>(() => {
  const hasZeroValue = props.source.some((item) => item.value === 0);
  return {
    type: "pie",
    center: ["50%", "45%"],
    startAngle: 15,
    itemStyle: {
      borderRadius: hasZeroValue ? "" : 4,
      borderColor: hasZeroValue ? "transparent" : "#fff",
      borderWidth: 2,
    },
    label: {
      show: false,
    },
  };
});
const option = computed(() => {
  const { source, color, series, seriesOption, legend, grid, tooltip } = props;
  if (source.length === 0) return {};
  const mixSeriesOption = { ...defaultOption.value, ...seriesOption };
  return {
    legend: {
      ...legend,
      ...defaultLegend,
    },
    dataset: {
      source,
    },
    tooltip: {
      ...defaultTooltip.value,
      ...tooltip,
    },
    color: color.length ? color : defaultColors.value,
    series: series || [mixSeriesOption],
  };
});
</script>

<style scoped></style>
