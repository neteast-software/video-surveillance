import * as Cesium from "cesium";
import Color from "cesium/Source/Core/Color";
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import { ref, watch } from "vue";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
const deviceInfo = useDeviceInfoStore();
const { filteredDataList, curdeviceListId } = storeToRefs(deviceInfo);

let entities: any = [];
let selectEntity: any = null; // 正在选中的实体
// let bounceInterval: any = null; // 弹跳动画的定时器

export const bubblePosition = ref([0, 0]); // 弹窗位置（相对于屏幕）
export const bubbleVisible = ref(false); // 弹窗是否显示

//添加标记点
export function addDemoGraphic1(viewer: Viewer) {
  if (filteredDataList.value.length === 0) return;
  filteredDataList.value.forEach((point) => {
    if (!viewer) return;
    const entity = viewer.entities.add({
      name: point.name,
      id: String(point.id),
      position: Cesium.Cartesian3.fromDegrees(
        point.position[0],
        point.position[1]
      ),
      billboard: {
        image: point.image,
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
      // heightReference: Cesium.HeightReference.NONE, // 不随地形高度变化
    });
    entities.push(entity);
    // entity.bounceState = false; // 初始状态为不弹跳
  });
}
export function removeAllEntities(viewer: Viewer) {
  entities.forEach((entity: any) => {
    viewer.entities.remove(entity);
  });
  // 清空实体列表
  entities = [];
}

// 计算 Cesium 3D 坐标在屏幕上的位置
export function calculateScreenPosition(
  viewer: Cesium.Viewer,
  position: Cesium.Cartesian3
) {
  const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    position
  );
  console.log("screenPosition", screenPosition);
  return screenPosition ? [screenPosition.x, screenPosition.y] : [0, 0];
}
// 处理实体缩放
function scaleEntity(entity: any, scale: number) {
  if (entity && entity.billboard) {
    entity.billboard.scale = scale;
  }
}
export function setupClickHandler(viewer: Viewer) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction((movement: any) => {
    const pickedObject = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && pickedObject.id) {
      const entity = pickedObject.id;

      // 恢复上一个选中实体的缩放
      if (selectEntity && selectEntity !== entity) {
        scaleEntity(selectEntity, 1);
      }
      if (entity && entity.position) {
        const position = entity.position.getValue(Cesium.JulianDate.now());
        bubblePosition.value = calculateScreenPosition(viewer, position);
        bubbleVisible.value = true;
        curdeviceListId.value = entity.id; // 更新当前选中的设备ID
        // 更新当前选中的实体并缩放
        selectEntity = entity;
        scaleEntity(selectEntity, 1.1);
      }
    } else {
      // 如果没有选中实体，则恢复之前的实体状态
      if (selectEntity) {
        scaleEntity(selectEntity, 1);
        selectEntity = null;
        bubbleVisible.value = false;
        curdeviceListId.value = 0; // 重置设备ID
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 监听设备列表 ID 的变化并处理选中状态
watch(curdeviceListId, (newId) => {
  entities.forEach((entity: any) => {
    if (entity.id == newId) {
      console.log("选中实体", entity);
      selectEntity = entity; // 更新选中实体
      scaleEntity(selectEntity, 1.1); // 缩放选中实体
      bubbleVisible.value = true; // 显示气泡
    } else {
      // 恢复未选中实体的缩放
      if (entity.billboard) {
        entity.billboard.scale = 1; // 恢复缩放
      }
    }
  });

  // 当没有选中实体时，隐藏气泡
  if (!newId) {
    bubbleVisible.value = false; // 隐藏气泡
  }
});

// 地图移动时更新 PointBubble 的位置
export function updateBubblePosition(viewer: Cesium.Viewer) {
  if (!selectEntity) return;
  const position = selectEntity.position.getValue(Cesium.JulianDate.now());
  const screenPosition = calculateScreenPosition(viewer, position);
  if (screenPosition) {
    bubblePosition.value = screenPosition;
  }
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
