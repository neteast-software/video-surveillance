export const deviceType = [
  { id: "0", name: "全部", type: "all" },
  { id: "2", name: "监控", type: "probe" },
  { id: "3", name: "安全帽", type: "helmet" },
] as const;

export function FilterStatus(typeValue: string | number) {
  switch (typeValue) {
    case "正常":
      return "primary";
    case "在线":
      return "success";
    case "离线":
      return "info";
    case "异常":
      return "warning";
    default:
      return "info";
  }
}
