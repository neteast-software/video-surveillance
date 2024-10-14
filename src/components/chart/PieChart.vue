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
  itemGap: 36,
  itemWidth: 16,
  itemHeight: 16,
  textStyle: {
    fontSize: 14,
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

const defaultOption = computed<PieSeriesOption>(() => ({
  type: "pie",
  // radius: ["50%", "70%"],
  center: ["50%", "40%"],
  startAngle: 15,
  itemStyle: {
    borderRadius: 4,
    borderColor: "#fff",
    borderWidth: 2,
  },
  label: {
    show: false,
    // position: "center",
    //   position: "outer",
    //   formatter: function (params) {
    //     const { percent, name } = params;
    //     return `{pre|${percent}%}\n{name|${name}} `;
    //   },
    //   rich: {
    //     pre: {
    //       fontSize: 24,
    //       padding: [0, -60],
    //       lineHeight: 30,
    //       // align: "center",
    //     },
    //     name: {
    //       fontSize: 16,
    //       lineHeight: 30,
    //       padding: [0, -60],
    //     },
    //   },
    //   fontSize: 12,
    //   // color: '#fff'
  },
  // emphasis: {
  //   label: {
  //     show: true,
  //     fontSize: 20,
  //     fontWeight: "bold",
  //   },
  // },
  // labelLine: {
  //   show: true,
  //   length: 20,
  //   length2: 55,
  // },
}));
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
