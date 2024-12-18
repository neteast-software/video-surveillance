import * as Cesium from "cesium";
import { Color } from "cesium";
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import { ref, watch } from "vue";
import { useDeviceInfoStore } from "@/stores/deviceInfo";
import { storeToRefs } from "pinia";
import { useEventBus } from "@vueuse/core";
import { scrollToItemKey, flyToPositionKey } from "@/config/eventBus";
import { useMapInfoStore } from "@/stores/mapInfo";
import { wind } from "@/assets/icons";

const mapInfo = useMapInfoStore();
const { curDetailId, alarmCurDetailId } = storeToRefs(mapInfo);

const deviceInfo = useDeviceInfoStore();
const { filteredDataList, curdeviceListId } = storeToRefs(deviceInfo);
const { getIconByTypeAndStatus } = deviceInfo;
const flyToPositionBus = useEventBus(flyToPositionKey);
let entities: any = [];
let selectEntity: any = null; // 正在选中的实体

export const bubblePosition = ref([0, 0]); // 弹窗位置（相对于屏幕）
export const bubbleVisible = ref(false); // 弹窗是否显示

//添加标记点
// function test(x,y){
//     console.log(x-0.00436)
//     console.log(y+0.00308)
//     return
// }
export const gcj02towgs84 = (lng, lat) => {
	const a = 6378245.0;
	const ee = 0.00669342162296594323;
	const pi = Math.PI;

	function transformlat(lng, lat) {
		let ret =
			-100.0 +
			2.0 * lng +
			3.0 * lat +
			0.2 * lat * lat +
			0.1 * lng * lat +
			0.2 * Math.sqrt(Math.abs(lng));
		ret +=
			((20.0 * Math.sin(6.0 * lng * pi) +
				20.0 * Math.sin(2.0 * lng * pi)) *
				2.0) /
			3.0;
		ret +=
			((20.0 * Math.sin(lat * pi) + 40.0 * Math.sin((lat / 3.0) * pi)) *
				2.0) /
			3.0;
		ret +=
			((160.0 * Math.sin((lat / 12.0) * pi) +
				320 * Math.sin((lat * pi) / 30.0)) *
				2.0) /
			3.0;
		return ret;
	}

	function transformlng(lng, lat) {
		let ret =
			300.0 +
			lng +
			2.0 * lat +
			0.1 * lng * lng +
			0.1 * lng * lat +
			0.1 * Math.sqrt(Math.abs(lng));
		ret +=
			((20.0 * Math.sin(6.0 * lng * pi) +
				20.0 * Math.sin(2.0 * lng * pi)) *
				2.0) /
			3.0;
		ret +=
			((20.0 * Math.sin(lng * pi) + 40.0 * Math.sin((lng / 3.0) * pi)) *
				2.0) /
			3.0;
		ret +=
			((150.0 * Math.sin((lng / 12.0) * pi) +
				300.0 * Math.sin((lng / 30.0) * pi)) *
				2.0) /
			3.0;
		return ret;
	}

	let dlat = transformlat(lng - 105.0, lat - 35.0);
	let dlng = transformlng(lng - 105.0, lat - 35.0);
	const radlat = (lat / 180.0) * pi;
	let magic = Math.sin(radlat);
	magic = 1 - ee * magic * magic;
	const sqrtmagic = Math.sqrt(magic);
	dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * pi);
	dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * pi);
	const mglat = lat + dlat;
	const mglng = lng + dlng;
	return [lng * 2 - mglng, lat * 2 - mglat];
};

export function addDemoGraphic1(viewer: Viewer) {
	if (filteredDataList.value.length === 0) return;
	filteredDataList.value.forEach((point) => {
		if (!viewer) return;
		const [lng, lat] = gcj02towgs84(Number(point.lng), Number(point.lat));
		if (Number(point.lng) === 0 || Number(point.lat) === 0) {
			return;
		}
		const entity = viewer.entities.add({
			name: point.name,
			id: String(point.id),
			// position: Cesium.Cartesian3.fromDegrees(
			// 	Number(point.lng) - 0.00436,
			// 	Number(point.lat) + 0.00308
			// ),

			position: Cesium.Cartesian3.fromDegrees(lng, lat),
			billboard: {
				image: getIconByTypeAndStatus(point.type, point.status),
				scale: 1,
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			},
		});
		entities.push(entity);
	});
}
//单独添加一个项目部
// viewer.entities.add({
//   name: "项目部",
//   id: "99",
//   position: Cesium.Cartesian3.fromDegrees(119.59135, 25.73374),
//   billboard: {
//     image: "/public/img/project-dep.svg",
//     scale: 1,
//     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
//     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//   },
//   // heightReference: Cesium.HeightReference.NONE, // 不随地形高度变化
// });
// entities.push(entity1);
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
	const screenPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
		viewer.scene,
		position
	);
	return screenPosition ? [screenPosition.x, screenPosition.y] : [0, 0];
}
// 处理实体缩放
function scaleEntity(entity: any, scale: number) {
	if (entity && entity.billboard) {
		entity.billboard.scale = scale;
	}
}
const scrollToItemBus = useEventBus(scrollToItemKey);
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
				const position = entity.position.getValue(
					Cesium.JulianDate.now()
				);
				bubblePosition.value = calculateScreenPosition(
					viewer,
					position
				);
				bubbleVisible.value = true;
				if (curDetailId.value !== 0) {
					curDetailId.value = entity.id; // 更新当前选中的设备ID
				}
				if (alarmCurDetailId.value !== 0) {
					alarmCurDetailId.value = entity.id; // 更新当前选中的告警设备ID
				}
				curdeviceListId.value = entity.id; // 更新当前选中的设备ID
				// 更新当前选中的实体并缩放
				selectEntity = entity;
				scaleEntity(selectEntity, 1.1);
				scrollToItemBus.emit(curdeviceListId.value);
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
		flyToPosition(viewer); // 飞到选中实体位置
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 监听设备列表 ID 的变化并处理选中状态
export function updatePointStatus(viewer: Viewer, newId: number) {
	let found = false;
	entities.forEach((entity: any) => {
		if (entity.id == newId) {
			found = true;
			selectEntity = entity; // 更新选中实体
			scaleEntity(selectEntity, 1.1); // 缩放选中实体
			bubbleVisible.value = true; // 显示气泡
			if (curDetailId.value !== 0) {
				curDetailId.value = newId; // 更新当前选中的设备ID
			}
			if (alarmCurDetailId.value !== 0) {
				alarmCurDetailId.value = newId; // 更新当前选中的告警设备ID
			}
			flyToPosition(viewer); // 飞到选中实体位置
		} else {
			// 恢复未选中实体的缩放
			if (entity.billboard) {
				entity.billboard.scale = 1; // 恢复缩放
			}
		}
	});
	// 当没有选中实体时，隐藏气泡
	if (!newId || !found) {
		bubbleVisible.value = false; // 隐藏气泡
		!found && window.$message.error("此设备暂无位置信息");
	}
}

//更新标记点变化
export function flyToPosition(viewer: Viewer) {
	if (!selectEntity) return;
	const position = selectEntity.position.getValue(Cesium.JulianDate.now());
	// 将 Cartesian3 转换为 Cartographic 以获取经纬度和高度
	const cartographic = Cesium.Cartographic.fromCartesian(position);
	const longitude = Cesium.Math.toDegrees(cartographic.longitude);
	const latitude = Cesium.Math.toDegrees(cartographic.latitude);
	const height = cartographic.height; // 获取当前高度
	const adjustedHeight = height + 10000;
	viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(
			longitude - 0.01,
			latitude + 0.015,
			adjustedHeight
		),
		orientation: {
			//初始方向
			heading: Cesium.Math.toRadians(0),
			pitch: Cesium.Math.toRadians(-90),
			roll: Cesium.Math.toRadians(0),
		},
		duration: 1.0, // 飞行持续时间，单位为秒
	});
}

// 地图移动时更新 PointBubble 的位置
export function updateBubblePosition(viewer: Cesium.Viewer) {
	if (!selectEntity) return;
	const position = selectEntity.position.getValue(Cesium.JulianDate.now());
	// console.log("updateBubblePosition", position);
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
