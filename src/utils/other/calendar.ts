// 获取当前星期一的日期
export function getMonday(d: Date) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 调整到上一周的周一
  return new Date(d.setDate(diff));
}

//获取当前星期日的日期
export function getSunday(d: Date) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() + (7 - day); // 调整到本周的周日
  return new Date(d.setDate(diff));
}
