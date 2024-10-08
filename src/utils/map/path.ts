import * as Cesium from "cesium";

//轨迹路线
const pathData = [
  [119.29541, 26.07788, 0],
  [119.29498, 26.07844, 0],
  [119.29603, 26.07904, 0],
  [119.29736, 26.07936, 0],
  [119.2979, 26.07776, 0],
  [119.29866, 26.07796, 0],
];

//添加默认路径
export function addPath(viewer: any) {
  viewer.entities.add({
    name: "line",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(pathData.flat()),
      width: 3,
      // material: Cesium.Color.BLUE,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.BLUE,
        dashLength: 16.0,
        dashPattern: 255,
      }),
    },
  });
  // 遍历路径数据，在每个转折点添加一个圆点
  pathData.forEach((pos, index) => {
    const position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2]);
    viewer.entities.add({
      position: position,
      point: {
        pixelSize: index === 3 ? 8 : 13,
        color: index === 3 ? Cesium.Color.WHITE : Cesium.Color.BLUE, // 第三个点为黄色空心圆点
        outlineColor:
          index === 3 ? Cesium.Color.ORANGE : Cesium.Color.TRANSPARENT, // 黄色空心的外轮廓
        outlineWidth: index === 3 ? 5 : 0, // 设定外轮廓宽度
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
  });
}

const startTime = new Date(); //开始时间
var stopTime: Date; //结束时间
let animationEntity: Cesium.Entity | undefined; //动画实体

// 设置动画
export function setupPathAnimation(viewer: Cesium.Viewer) {
  const property = new Cesium.SampledPositionProperty(); // 创建一个 SampledPositionProperty 实例
  const startTime = new Date(); // 开始时间
  const timestamp = startTime.getTime(); // 时间戳
  //遍历坐标
  pathData.forEach((pos, index) => {
    const time = new Date(timestamp + index * 1000); // 每隔 1 秒添加一个点
    stopTime = time;
    const position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2]);
    property.addSample(Cesium.JulianDate.fromDate(time), position);
  });
  animationEntity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      // 设置动画的时间范围
      new Cesium.TimeInterval({
        start: Cesium.JulianDate.fromDate(startTime), // 开始时间
        stop: Cesium.JulianDate.fromDate(stopTime), // 结束时间
      }),
    ]),
    position: property,
    billboard: {
      image: "/img/icon/moving-point.svg",
      scale: 1.5,
      pixelOffset: new Cesium.Cartesian2(0, 0),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    path: {
      leadTime: 0,
      resolution: 1,
      material: Cesium.Color.BLUE,
      width: 3,
    },
  });
  // 设置时钟属性，确保动画不自动开始
  viewer.clock.shouldAnimate = false;
  //设置插值
  property.setInterpolationOptions({
    interpolationDegree: 0.0001,
    interpolationAlgorithm: Cesium.LinearApproximation,
  });
}
// 启动动画
export function startAnimation(viewer: any) {
  if (viewer && animationEntity) {
    console.log("开始动画", viewer.clock);
    viewer.trackedEntity = undefined; // 不跟随镜头
    const currentTime = viewer.clock.currentTime;
    const startJulianDate = Cesium.JulianDate.fromDate(startTime);

    // 设置时钟时间与动画的起始时间对齐
    viewer.clock.currentTime = currentTime; // 设置当前时间
    viewer.clock.shouldAnimate = true; // 开始动画
    viewer.clock.startTime = startJulianDate; // 设置开始时间
    viewer.clock.stopTime = Cesium.JulianDate.fromDate(stopTime); // 设置结束时间
    // viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 循环播放

    // 更新动画实体的位置属性
    const newProperty = new Cesium.SampledPositionProperty();
    pathData.forEach((pos, index) => {
      const time = new Date(startTime.getTime() + index * 1000);
      const position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2]);
      newProperty.addSample(Cesium.JulianDate.fromDate(time), position);
    });

    animationEntity.position = newProperty;
  }
}

export function stopAnimation(viewer: any) {
  if (viewer) {
    viewer.clock.shouldAnimate = false;
  }
}

//绘制多边形
// 多边形全部点的数组
var polygon_point_arr: any[] = [];
// 临时多边形entity
var temporary_polygon_entity: any = null;
var handler: any = null;

// 开启绘制的方法
export function click_draw_polygon(viewer: any) {
  // 清除可能会用到的监听事件
  if (handler) {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  //鼠标左键--确定选中点
  handler.setInputAction((event: any) => {
    // 屏幕坐标转为空间坐标
    const cartesian = viewer.camera.pickEllipsoid(
      event.position, // 鼠标点击的位置
      viewer.scene.globe.ellipsoid // 椭球体
    );
    // 判断是否定义（是否可以获取到空间坐标）
    if (Cesium.defined(cartesian)) {
      // 将点添加进保存多边形点的数组中，鼠标停止移动的时添加的点和，点击时候添加的点，坐标一样
      polygon_point_arr.push(cartesian);
      // 判断是否开始绘制动态多边形，没有的话则开始绘制
      if (temporary_polygon_entity == null) {
        // 绘制动态多边形
        draw_dynamic_polygon(viewer);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //鼠标移动--实时绘制多边形
  handler.setInputAction((event: any) => {
    // 屏幕坐标转为空间坐标
    let cartesian = viewer.camera.pickEllipsoid(
      event.endPosition,
      viewer.scene.globe.ellipsoid
    );
    // 判断是否定义（是否可以获取到空间坐标）
    if (Cesium.defined(cartesian)) {
      // 判断是否已经开始绘制动态多边形，已经开始的话，则可以动态拾取鼠标移动的点，修改点的坐标
      if (temporary_polygon_entity) {
        // 只要元素点大于一，每次就删除一个点，因为实时动态的点是添加上去的
        if (polygon_point_arr.length > 1) {
          // 删除数组最后一个元素（鼠标移动添加进去的点）
          polygon_point_arr.pop();
        }
        // 将新的点添加进动态多边形点的数组中，用于实时变化，注意：这里是先添加了一个点，然后再删除点，再添加，这样重复的
        polygon_point_arr.push(cartesian);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //鼠标右键--结束绘制
  handler.setInputAction((event: any) => {
    // 取消鼠标移动监听
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // 清除动态绘制的多边形
    viewer.entities.remove(temporary_polygon_entity);
    // 删除保存的临时多边形的entity
    temporary_polygon_entity = null;
    // 绘制结果多边形
    draw_polygon(viewer);
    // 清空多边形点数组，用于下次绘制
    polygon_point_arr = [];
    // 清除所有事件
    if (handler) {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

//绘制动态多边形
function draw_dynamic_polygon(viewer: any) {
  temporary_polygon_entity = viewer.entities.add({
    polygon: {
      // 这个方法上面有重点说明
      hierarchy: new Cesium.CallbackProperty(() => {
        // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
        return new Cesium.PolygonHierarchy(polygon_point_arr);
      }, false),
      extrudedHeight: 0, // 多边体的高度（多边形拉伸高度）
      height: 10, // 多边形离地高度
      material: Cesium.Color.RED.withAlpha(0.5),
    },
  });
}

//绘制结果多边形
function draw_polygon(viewer: any) {
  // 删除最后一个动态添加的点，如果鼠标没移动，最后一个和倒数第二个是一样的，所以也要删除
  polygon_point_arr.pop();
  // 三个点以上才能绘制成多边形
  if (polygon_point_arr.length >= 3) {
    let polygon_point_entity = viewer.entities.add({
      polygon: {
        hierarchy: polygon_point_arr,
        extrudedHeight: 0, // 多边体的高度（多边形拉伸高度）
        height: 10, // 多边形离地高度
        material: Cesium.Color.RED.withAlpha(0.5),
        outlineColor: Cesium.Color.RED,
        outlineWidth: 2,
      },
    });
    // 坐标转换--这里可以输出所有点位坐标，不需要就删除了
    // polygon_point_arr.forEach(val => {
    //   let polyObj = {}
    //   let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(val)
    //   polyObj.lon = Cesium.Math.toDegrees(cartographic.longitude)
    //   polyObj.lat = Cesium.Math.toDegrees(cartographic.latitude)
    //   point_arr.push([polyObj.lon, polyObj.lat])
    // })
    // return point_arr;
  } else {
    return;
  }
}
