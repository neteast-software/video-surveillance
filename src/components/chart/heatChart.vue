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
import { BaseChartProps } from "./index";
import { LineSeriesOption } from "echarts/charts";
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from "echarts";
// import useTheme from "@/utils/theme";

// 获取主题颜色
// const { colorPrimary, colorBg, colorText } = useTheme();
// const defaultColors = computed(() => {
//   return ["#2D9CDB", "#4DC591", "#FF7648", "#F94144"];
// });
// 定义组件接收的 props
interface Props extends BaseChartProps {
  xAxis?: XAXisComponentOption;
  yAxis?: YAXisComponentOption;
  legend?: LegendComponentOption;
  tooltip?: TooltipComponentOption;
  color?: string[] | string;
  series?: LineSeriesOption | LineSeriesOption[];
  grid?: GridComponentOption;
  xAxisData: string[];
  yAxisData: string[];
}

// 设置默认 props
const props = withDefaults(defineProps<Props>(), {
  color: () => [],
});

const defaultGrid: GridComponentOption = {
  left: "3%",
  right: "3%",
  bottom: "15%",
  top: "15%",
};
// 默认 X 轴设置
const defaultXAxis: XAXisComponentOption = {
  type: "category", // X轴是类别轴
  data: props.xAxisData,
  splitArea: {
    show: true, // 显示分割区域
  },
};

// 默认 Y 轴设置
const defaultYAxis: YAXisComponentOption = {
  type: "category", // Y轴也是类别轴
  data: props.yAxisData,
  splitArea: {
    show: true,
  },
};

// 默认图例设置
const defaultLegend: LegendComponentOption = {
  icon: "ract",
  top: 0,
  itemGap: 10,
  itemWidth: 8,
  itemHeight: 8,
  textStyle: {
    fontSize: 10,
  },
};

// 默认提示框配置
const defaultTooltip = computed<TooltipComponentOption>(() => ({
  show: true,
  trigger: "axis",
  //   backgroundColor: colorBg.value,
  textStyle: {
    // color: colorText.value,
  },
}));

// 默认颜色
// const defaultColors = computed(() => [
//   "#2D9CDB",
//   "#4DC591",
//   "#FF7648",
//   "#F94144",
// ]);

// 计算图表配置项
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

  // 如果 source 数据为空，返回空对象
  if (source.length < 1) return {};

  return {
    grid: { ...defaultGrid, ...grid }, // 合并网格配置
    dataset: {
      source, // 绑定外部传入的 source 数据
    },
    xAxis: {
      ...defaultXAxis,
      ...xAxis,
      name: xAxisName, // X轴名称
    },
    yAxis: {
      ...defaultYAxis,
      ...yAxis,
      name: yAxisName, // Y轴名称
    },
    color: "#3563EF",
    series: {
      type: "heatmap", // 热力图类型
      // coordinateSystem: "calendar",
      label: {
        show: true, // 显示标签
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          // shadowColor: "rgba(0, 0, 0, 0.5)", // 强调样式
        },
      },
    },
    visualMap: {
      min: 0,
      max: 1000,
      calculable: true, // 可计算
      type: "piecewise",
      orient: "horizontal",
      left: "right",
      top: 8,
    },
    legend: {
      ...defaultLegend,
      ...legend, // 合并图例配置
    },
    tooltip: {
      ...defaultTooltip.value,
      ...tooltip, // 合并提示框配置
    },
  };
});
</script>

<style scoped></style>
