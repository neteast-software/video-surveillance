import { Ref } from 'vue';

//cnavas绘制多条虚线
export function drawDashed(dateLine: Ref<HTMLCanvasElement | undefined>) {
    console.log('绘制虚线');
    const canvas = dateLine.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // 设置Canvas的宽度和高度与容器匹配
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const lineSpacing = 15;
    const numLines = Math.ceil(canvas.width / lineSpacing);
    console.log(canvas.width, numLines);
    ctx.setLineDash([5, 2]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i < numLines; i++) {
        const y = i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(y, 0);
        ctx.lineTo(y, canvas.width);
        ctx.stroke();
    }
}
// 遍历 events 数组绘制事件线段
export function drawEvents(
    eventsLine: Ref<HTMLCanvasElement | undefined>,
    events: { time: string; type: string; desc: string }[],
    startTime: Date,
    endTime: Date
) {
    const canvas = eventsLine.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.setLineDash([]);
    for (const event of events) {
        const eventTime = new Date(event.time);
        const eventX =
            ((eventTime.getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime())) * canvas.width;
        // 根据事件类型确定线段颜色
        ctx.strokeStyle = event.type === 'info' ? '#4DC591' : '#EA6733';
        ctx.beginPath();
        ctx.moveTo(eventX, 0);
        ctx.lineTo(eventX, canvas.height);
        ctx.stroke();
    }
}
// NDatePicker日期区间
export const dateDisabled = (ts: number): boolean => {
    const today = new Date();
    return new Date(ts) > today;
};
