import * as Cesium from "cesium";

//轨迹路线
const pathData = [
  [119.59287, 25.80441, 0],
  [119.59786, 25.79123, 0],
  [119.60113, 25.77988, 0],
  [119.60306, 25.77189, 0],
  [119.60316, 25.76776, 0],
  [119.60271, 25.75868, 0],
  [119.59766, 25.74937, 0],
  [119.595, 25.73713, 0],
  [119.59241, 25.73153, 0],
  [119.59197, 25.72438, 0],
  [119.58747, 25.71574, 0],
  [119.5854, 25.71019, 0],
  [119.58203, 25.70248, 0],
  [119.57804, 25.6969, 0],
  [119.57461, 25.69516, 0],
];
const SpecificPathData1 = [
  [119.60271, 25.75868, 0],
  [119.59766, 25.74937, 0],
];
const SpecificPathData2 = [
  [119.595, 25.73713, 0],
  [119.59241, 25.73153, 0],
];
const SpecificPathData3 = [
  [119.58747, 25.71574, 0],
  [119.5854, 25.71019, 0],
];
// 样条插值函数
function generateSmoothPath(positions: [Cesium.Cartesian3]) {
  const spline = new Cesium.CatmullRomSpline({
    times: positions.map((_, index) => index), // 给每个点一个时间戳（整数索引）
    points: positions,
  });
  // 在样条曲线中插入更多的点以使其看起来更平滑
  const smoothPositions = [];
  for (let i = 0; i <= positions.length - 1; i += 0.1) {
    smoothPositions.push(spline.evaluate(i));
  }
  return smoothPositions;
}
// 添加默认路径
export function addPath(viewer: Cesium.Viewer) {
  if (!viewer) return;
  // 将路径点转换为 Cesium.Cartesian3 并插值生成平滑的曲线
  const positions = pathData.map(([lon, lat, height]) =>
    Cesium.Cartesian3.fromDegrees(lon, lat, height)
  );
  const smoothPositions = generateSmoothPath(positions);
  // 添加实体，使用平滑的路径点
  viewer.entities.add({
    name: "smooth line",
    polyline: {
      positions: smoothPositions, // 使用平滑插值后的坐标
      width: 10, // 路线宽度
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.fromCssColorString("#FF00FF") // 设置为 #FF00FF 并添加透明度
      ),
      clampToGround: true, // 将线钉在地面上
    },
  });
  // // 添加路径点;
  // pathData.forEach((pos, index) => {
  //   const position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2]);
  //   viewer.entities.add({
  //     position: position,
  //     point: {
  //       pixelSize: index === 3 ? 8 : 13,
  //       color: index === 3 ? Cesium.Color.WHITE : Cesium.Color.BLUE, // 第三个点为黄色空心圆点
  //       outlineColor:
  //         index === 3 ? Cesium.Color.ORANGE : Cesium.Color.TRANSPARENT, // 黄色空心的外轮廓
  //       outlineWidth: index === 3 ? 5 : 0, // 设定外轮廓宽度
  //       // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  //     },
  //   });
  // });
}
//添加特定路径
function addSpecificPath(
  viewer: Cesium.Viewer,
  positionData: number[][],
  color?: string
) {
  if (!viewer) return;
  // 将路径点转换为 Cesium.Cartesian3 并插值生成平滑的曲线
  const positions = positionData.map(([lon, lat, height]) =>
    Cesium.Cartesian3.fromDegrees(lon, lat, height)
  );
  const smoothPositions = generateSmoothPath(positions);
  // 添加实体，使用平滑的路径点
  viewer.entities.add({
    name: "smooth line",
    polyline: {
      positions: smoothPositions, // 使用平滑插值后的坐标
      width: 10, // 路线宽度
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.fromCssColorString(color ? color : "#FDFD04") // 设置为 #FF00FF 并添加透明度
      ),
      clampToGround: true, // 将线钉在地面上
    },
  });
}

//添加标签
const cardData1 = {
  position: [119.587, 25.712],
  text: "MK8+029.92\n旗北路下穿通道\n全长630米",
};
const cardData2 = {
  position: [119.5945, 25.733],
  text: "MK4+833.00\n大东海高架桥\n全长685米",
};
function drawCard(
  viewer: Cesium.Viewer,
  position: [number, number],
  text: string
) {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(...position),
    label: {
      text: text,
      font: "14px Source Han Sans CN", //字体样式
      fillColor: Cesium.Color.BLACK, //字体颜色
      backgroundColor: Cesium.Color.WHITE, //背景颜色
      showBackground: true, //是否显示背景颜色
      verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
      pixelOffset: new Cesium.Cartesian2(10, 0), //偏移
      backgroundPadding: new Cesium.Cartesian2(10, 5), // 设置内边距，左右和上下.
      scale: 1,
    },
  });
}

export function addAllPath(viewer: Cesium.Viewer) {
  // 添加默认路径
  addSpecificPath(viewer, SpecificPathData1);
  addSpecificPath(viewer, SpecificPathData2);
  addSpecificPath(viewer, SpecificPathData3, "#0000FF");
  addPath(viewer);
  drawCard(viewer, cardData1.position, cardData1.text);
  drawCard(viewer, cardData2.position, cardData2.text);
}
