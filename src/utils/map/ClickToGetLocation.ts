import * as Cesium from "cesium";

//点击获取当前位置信息
export function ClickToGetLocation(viewer: any) {
  if (!viewer) return;
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas); //点击获取坐标
  var annotations = viewer.scene.primitives.add(new Cesium.LabelCollection()); //标签集合
  //todo：在椭球下点击创建点
  //点击事件
  handler.setInputAction(function (event: any) {
    var earthPosition = viewer.camera.pickEllipsoid(
      event.position,
      viewer.scene.globe.ellipsoid
    ); //返回在椭球上面的点的坐标
    if (Cesium.defined(earthPosition) && earthPosition) {
      // createPoint(earthPosition, viewer); //在点击位置添加一个点
      // 获取这个点的坐标
      var cartographic = Cesium.Cartographic.fromCartesian(earthPosition);

      var longitudeString = Cesium.Math.toDegrees(
        cartographic.longitude
      ).toFixed(5);
      var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(
        5
      );
      console.log("cartographic", cartographic, longitudeString);
      var heightString = cartographic.height.toFixed(5);
      var location = {
        longitude: longitudeString,
        latitude: latitudeString,
        height: heightString,
      };
      console.log(
        "location",
        location,
        "当前坐标：" + location.longitude + ", " + location.latitude
      );
      // annotate(earthPosition, location, annotations, viewer);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

//信息提示框
export function annotate(
  cartesian: any,
  location: any,
  annotations: any,
  viewer: any
) {
  createPoint(cartesian, viewer);
  annotations.add({
    position: cartesian,
    text: location,
    showBackground: true,
    font: "14px monospace",
    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  });
}

//添加点
export function createPoint(worldPosition: any, viewer: any) {
  var point = viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 5,
    },
  });
  return point;
}
