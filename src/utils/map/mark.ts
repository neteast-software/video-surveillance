import * as Cesium from "cesium";
import Color from "cesium/Source/Core/Color";
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
const points = [
  {
    name: "点1",
    label: "这是点1",
    position: [119.3, 26.078],
    image: "/img/blue.svg",
  },
  {
    name: "点2",
    label: "这是点2",
    position: [119.3001, 26.076],
    image: "/img/red.svg",
  },
  {
    name: "点3",
    label: "这是点3",
    position: [119.2938, 26.078],
    image: "/img/yellow.svg",
  },
  {
    name: "点4",
    label: "这是点4",
    position: [119.2936, 26.08],
    image: "/img/orange.svg",
  },
  {
    name: "点5",
    label: "这是点5",
    position: [119.29503, 26.08031],
    image: "/img/red.svg",
  },
  {
    name: "点6",
    label: "这是点6",
    position: [119.29722, 26.07691],
    image: "/img/yellow.svg",
  },
  {
    name: "点7",
    label: "这是点7",
    position: [119.29563, 26.0765],
    image: "/img/orange.svg",
  },
  {
    name: "点8",
    label: "这是点8",
    position: [119.29672, 26.07579],
    image: "/img/blue.svg",
  },
];
//添加标记点
export function addDemoGraphic1(viewer: Viewer) {
  points.forEach((point) => {
    if (!viewer) return;
    const entity = viewer.entities.add({
      name: point.name,
      position: Cesium.Cartesian3.fromDegrees(
        point.position[0],
        point.position[1]
      ),
      label: {
        text: point.label,
        font: "500 30px Helvetica",
        scale: 0.5,
        style: Cesium.LabelStyle.FILL,
        fillColor: Cesium.Color.WHITE,
        pixelOffset: new Cesium.Cartesian2(0, -60),
        showBackground: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        show: false,
      },
      billboard: {
        image: point.image,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
      heightReference: Cesium.HeightReference.NONE,
    });
    entity.bounceState = false; // 初始状态为不弹跳
  });
}

let bouncingEntity = null;
let bounceInterval = null;

function startBounce(entity, position) {
  if (bounceInterval) {
    clearInterval(bounceInterval);
    if (bouncingEntity) {
      stopBounce(bouncingEntity, bouncingEntity.originalPosition);
    }
  }
  bouncingEntity = entity;
  entity.originalPosition = [...position];
  const addHei = 10;
  let direction = 1;
  const bounceHeight = 0.5;

  entity.label.show = true; // 显示标签

  bounceInterval = setInterval(() => {
    const currentPosition = Cesium.Cartographic.fromCartesian(
      entity.position.getValue(Cesium.JulianDate.now())
    );
    const newHeight =
      (addHei / 2) * Math.sin(((Date.now() % 1000) / 1000) * 2 * Math.PI);
    entity.position = Cesium.Cartesian3.fromDegrees(
      Cesium.Math.toDegrees(currentPosition.longitude),
      Cesium.Math.toDegrees(currentPosition.latitude),
      newHeight
    );
  }, 30);
}

function stopBounce(entity, position) {
  clearInterval(bounceInterval);
  bounceInterval = null;
  entity.position = Cesium.Cartesian3.fromDegrees(position[0], position[1], 0);
  bouncingEntity = null;
  entity.label.show = false; // 隐藏标签
}

export function setupClickHandler(viewer: Viewer) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction((movement) => {
    const pickedObject = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && pickedObject.id) {
      const entity = pickedObject.id;
      if (entity && entity.position) {
        const position = entity.position.getValue(Cesium.JulianDate.now());
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);

        // Start bouncing if not already bouncing
        if (bouncingEntity !== entity) {
          startBounce(entity, [longitude, latitude, 0]);
        }
      }
    } else {
      // Clicked outside any entities; stop current bouncing
      if (bouncingEntity) {
        stopBounce(bouncingEntity, bouncingEntity.originalPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 动态扩散圆的实现
// position: Cesium.Cartesian3.fromDegrees(119.296, 26.075),
export function addDemoGraphic2(viewer: any) {
  var x = 1;
  var flog = true;
  viewer.entities.add({
    name: "圆形",
    position: Cesium.Cartesian3.fromDegrees(119.297, 26.08),
    ellipse: {
      semiMinorAxis: 15.0,
      semiMajorAxis: 15.0,
      material: Color.RED,
    },
  });
  viewer.entities.add({
    name: "圆形区域闪烁",
    position: Cesium.Cartesian3.fromDegrees(119.297, 26.08),
    ellipse: {
      semiMinorAxis: 30.0,
      semiMajorAxis: 30.0,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(function () {
          if (flog) {
            x = x - 0.05;
            if (x <= 0) {
              flog = false;
            }
          } else {
            x = x + 0.05;
            if (x >= 1) {
              flog = true;
            }
          }
          return Cesium.Color.RED.withAlpha(x);
        }, false)
      ),
    },
  });
}