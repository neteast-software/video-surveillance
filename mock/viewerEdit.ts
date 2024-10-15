import { MockMethod } from "vite-plugin-mock";

export default {
  url: '/device/console/device/135852/cate/edit',
  method: 'get',
  response: {
    "code": 0,
    "data": {
      "graph": {
        "name": "编辑设备信息",
        "items": [
          {
            "component": "line",
            "name": "",
            "label": "基本信息",
            "showLabel": false
          },
          {
            "component": "input",
            "name": "name",
            "label": "设备名称",
            "showLabel": true,
            "value": "",
            "readonly": true,
            "attrs": {
              "type": "text"
            }
          },
          {
            "component": "input",
            "name": "system",
            "label": "所属子系统",
            "showLabel": true,
            "value": "",
            "readonly": true,
            "attrs": {
              "type": "text"
            }
          },
          {
            "component": "line",
            "name": "",
            "label": "基础配置",
            "showLabel": false
          },
          {
            "component": "input",
            "name": "asset_id",
            "label": "资产编号（点位编号）",
            "showLabel": true,
            "value": "",
            "attrs": {
              "type": "text",
              "maxlength": 128
            }
          },
          {
            "component": "line",
            "name": "",
            "label": "大类修改",
            "showLabel": false
          },
          {
            "component": "select",
            "name": "cate_id",
            "label": "设备大类",
            "showLabel": true,
            "attrs": {
              "options": [
                {
                  "name": "智能电表",
                  "value": 1
                },
                {
                  "name": "智能水表",
                  "value": 2
                },
                {
                  "name": "空气监测",
                  "value": 3
                },
                {
                  "name": "温湿度监测",
                  "value": 4
                },
                {
                  "name": "电梯",
                  "value": 5
                },
                {
                  "name": "空调",
                  "value": 6
                },
                {
                  "name": "排水",
                  "value": 7
                },
                {
                  "name": "集水",
                  "value": 8
                },
                {
                  "name": "摄像头",
                  "value": 9
                },
                {
                  "name": "人行道闸",
                  "value": 10
                },
                {
                  "name": "车辆道闸",
                  "value": 11
                },
                {
                  "name": "门禁",
                  "value": 12
                },
                {
                  "name": "智能门锁",
                  "value": 13
                },
                {
                  "name": "门锁网关",
                  "value": 14
                },
                {
                  "name": "信息发布屏",
                  "value": 15
                },
                {
                  "name": "场景面板",
                  "value": 16
                },
                {
                  "name": "消防",
                  "value": 17
                },
                {
                  "name": "人体感应器",
                  "value": 20
                },
                {
                  "name": "照明",
                  "value": 21
                },
                {
                  "name": "新风",
                  "value": 24
                }
              ],
              "placeholder": "选择一个设备大类",
              "labelField": "name"
            }
          },
          {
            "component": "input",
            "name": "id",
            "label": "",
            "hidden": true,
            "showLabel": true,
            "attrs": {
              "type": "text"
            }
          }
        ],
        "placement": "right",
        "submitUrl": "device/console/device/:id/cate/save",
        "submitMethod": "put",
        "data": {
          "id": 135852,
          "name": "门禁控制器MJ-S3F-ZJ-002_门_2",
          "system": "access",
          "cate_id": 0,
          "asset_id": null
        }
      },
      "type": "popForm"
    },
    "type": "success"
  }

} as MockMethod