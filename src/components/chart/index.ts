import { LineSeriesOption, GridComponentOption } from "echarts";
export type DatasetSource = (string | number)[][];
export interface BaseChartProps {
  xAxisName?: string;
  yAxisName?: string;
  source: DatasetSource;
}

export const defaultGrid: GridComponentOption = {
  left: "8%",
  right: "5%",
  bottom: "24%",
  top: "15%",
};
export const lineDefaultSeries: LineSeriesOption = {
  type: "line",
  seriesLayoutBy: "row",
  lineStyle: {
    width: 3,
    cap: "round",
  },
  symbolSize: 5,
  symbol: "circle",
};

export { default as PieChart } from "./PieChart.vue";
