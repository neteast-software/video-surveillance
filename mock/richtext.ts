import { MockMethod } from "vite-plugin-mock";

export default {
  url: '/linker/richtext',
  method: 'get',
  response: () => {
    return {
      "msg": "操作成功",
      "code": 200,
      "data": {
        "type": "popForm",
        "attrs": {
          "width": "100%",
          "height": "100%"
        },
        "graph": {
          "name": "修改产品",
          "inner": false,
          "items": [
            {
              "name": "id",
              "hidden": true,
              "component": "input"
            },
            {
              "name": "typeId",
              "attrs": {
                "labelField": "name",
                "valueField": "id",
                "placeholder": "请选择产品类别",
                "options": [
                  {
                    "id": 1,
                    "name": "云服务产品",
                    "image": "https://foodie.neteast.cn/f/1834529055108042752",
                    "subtitle": "云端创新先锋 ，重塑行业新格局"
                  },
                  {
                    "id": 2,
                    "name": "系统集成",
                    "image": "https://foodie.neteast.cn/f/1834532341403951104",
                    "subtitle": "打造智能系统集成 ，引领科技新潮流"
                  },
                  {
                    "id": 3,
                    "name": "定制开发",
                    "image": "https://foodie.neteast.cn/f/1834532377961504768",
                    "subtitle": "满足特定需求的定制开发 ，助力企业腾飞"
                  },
                  {
                    "id": 4,
                    "name": "小工具",
                    "image": "https://foodie.neteast.cn/f/1834532415085289473",
                    "subtitle": "实用小工具，便捷大帮手，让生活更轻松"
                  }
                ]
              },
              "label": "产品类别",
              "rules": [
                {
                  "tigger": "input",
                  "message": "请选择产品类别",
                  "required": true
                }
              ],
              "component": "select"
            },
            {
              "name": "name",
              "attrs": {
                "maxlength": 10,
                "placeholder": "请输入产品名称"
              },
              "label": "产品名称",
              "rules": [
                {
                  "tigger": "input",
                  "message": "请填写产品名称",
                  "required": true
                }
              ],
              "component": "input"
            },
            {
              "name": "imgFiles",
              "attrs": {
                "max": 1,
                "name": "file",
                "accept": ".jpeg, .jpg, .png",
                "action": "/file/upload",
                "headers": [
                  {
                    "name": "scope",
                    "value": "np"
                  }
                ],
                "listType": "image-card",
                "sizeLimit": "5",
                "defaultUpload": true
              },
              "label": "封面图片",
              "rules": [
                {
                  "tigger": "input",
                  "message": "请上传封面图片",
                  "required": true
                }
              ],
              "component": "upload"
            },
            {
              "name": "subtitle",
              "attrs": {
                "maxlength": 50,
                "placeholder": "请输入副标题"
              },
              "label": "副标题",
              "rules": [
                {
                  "tigger": "input",
                  "message": "请填写副标题",
                  "required": true
                }
              ],
              "component": "input"
            },
            {
              "name": "count",
              "attrs": {
                "maxlength": 7,
                "placeholder": "请输入用户数量"
              },
              "label": "用户数量",
              "rules": [],
              "component": "input"
            },
            {
              "name": "userAvatarFiles",
              "attrs": {
                "max": 10,
                "name": "file",
                "accept": ".jpeg, .jpg, .png",
                "action": "/file/upload",
                "headers": [
                  {
                    "name": "scope",
                    "value": "np"
                  }
                ],
                "listType": "image-card",
                "sizeLimit": "5",
                "defaultUpload": true
              },
              "label": "用户头像",
              "rules": [],
              "component": "upload"
            },
            {
              "name": "notice",
              "attrs": {
                "type": "textarea",
                "maxlength": 100,
                "placeholder": "请输入公告"
              },
              "label": "公告",
              "rules": [
                {
                  "tigger": "input",
                  "message": "请填写公告",
                  "required": true
                }
              ],
              "component": "input"
            },
            {
              "name": "showProduct",
              "attrs": {},
              "label": "显示项目",
              "rules": [
                {
                  "tigger": "input",
                  "message": "请选择显示项目",
                  "required": true
                }
              ],
              "component": "switch"
            },
            {
              "name": "appid",
              "attrs": {
                "maxlength": 50,
                "placeholder": "请输入小程序id"
              },
              "label": "小程序id",
              "rules": [],
              "component": "input"
            },
            {
              "name": "path",
              "attrs": {
                "maxlength": 100,
                "placeholder": "请输入小程序路径"
              },
              "label": "小程序路径",
              "rules": [],
              "component": "input"
            },
            {
              "name": "videoFiles",
              "attrs": {
                "max": 1,
                "name": "file",
                "accept": ".mp4",
                "action": "/file/upload",
                "headers": [
                  {
                    "name": "scope",
                    "value": "np"
                  }
                ],
                "listType": "text",
                "sizeLimit": "20",
                "defaultUpload": true
              },
              "label": "宣传视频",
              "rules": [],
              "component": "upload"
            },
            {
              "name": "contentData",
              "attrs": {
                "placeholder": "请输入产品说明"
              },
              "label": "产品说明",
              "rules": [],
              "component": "richtext"
            }
          ],
          "buttons": [],
          "placement": "right",
          "submitUrl": "/product/modify",
          "submitMethod": "put",
          "widthPercent": "100%",
          "heightPercent": "100%"
        },
        "data": {
          "id": 1,
          "typeId": 1,
          "typeName": null,
          "name": "智慧环卫考评系统",
          "img": "https://foodie.neteast.cn/f/1834527220913737728",
          "imgFiles": [
            {
              "name": null,
              "code": null,
              "url": "https://foodie.neteast.cn/f/1834527220913737728",
              "size": null,
              "extension": null,
              "scope": null,
              "mimetype": "image/jpeg",
              "relativeUrl": null
            }
          ],
          "subtitle": "移动互联网时代的巡检新实践",
          "videoUrl": null,
          "videoFiles": null,
          "content": "<p><img src=\"https://foodie.neteast.cn/f/1838488229450428416\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488264481255424\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488308131377152\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488322824024064\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488295812706304\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488278330847232\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488284802658304\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488293627473920\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488271506714624\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488243887222784\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/></p>",
          // "contentData": {
          //   "content": "<p><img src=\"https://foodie.neteast.cn/f/1838488229450428416\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488264481255424\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488308131377152\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488322824024064\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488295812706304\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488278330847232\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488284802658304\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488293627473920\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488271506714624\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/><img src=\"https://foodie.neteast.cn/f/1838488243887222784\" alt=\"\" data-href=\"\" style=\"width: 100%;\"/></p>",
          //   "summary": null
          // },
          "appid": null,
          "path": null,
          "notice": "对环卫考评系统进行了部分功能升级，现将升级后的主要变化公告如下：优化考评指标，我们对环卫工作的各项考评指标进行了细化和完善，使其更具针对性和可操作性。",
          "count": 83,
          "showProduct": true,
          "userAvatar": "https://foodie.neteast.cn/f/1839124358306541568,https://foodie.neteast.cn/f/1839118214322270208,https://foodie.neteast.cn/f/1839124411377070080,https://foodie.neteast.cn/f/1839120047140843520",
          "userAvatarFiles": [
            {
              "name": null,
              "code": null,
              "url": "https://foodie.neteast.cn/f/1839124358306541568",
              "size": null,
              "extension": null,
              "scope": null,
              "mimetype": "image/jpeg",
              "relativeUrl": null
            },
            {
              "name": null,
              "code": null,
              "url": "https://foodie.neteast.cn/f/1839118214322270208",
              "size": null,
              "extension": null,
              "scope": null,
              "mimetype": "image/jpeg",
              "relativeUrl": null
            },
            {
              "name": null,
              "code": null,
              "url": "https://foodie.neteast.cn/f/1839124411377070080",
              "size": null,
              "extension": null,
              "scope": null,
              "mimetype": "image/jpeg",
              "relativeUrl": null
            },
            {
              "name": null,
              "code": null,
              "url": "https://foodie.neteast.cn/f/1839120047140843520",
              "size": null,
              "extension": null,
              "scope": null,
              "mimetype": "image/jpeg",
              "relativeUrl": null
            }
          ]
        }
      }
    }
  }
} as MockMethod