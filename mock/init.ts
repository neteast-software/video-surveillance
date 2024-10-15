import { MockMethod } from "vite-plugin-mock";

export default {
  url: '/init',
  method: 'get',
  response: () => {
    return {
      "code": 0,
      "console": {
        "root": "/linker/viewer",
        "name": "建管一体化智慧巡检",
        "logo": "https://qiniu.linfun.cn/me.png",
        "menu": [
          {
            "icon": "heroicons:academic-cap",
            "name": "首页",
            "link": "/dashboard"
          },
          {
            "name": "地图",
            "link": "/cockpit"
          },
          {
            "name": "人员",
            "child": [
              {
                "name": "人员列表",
                "link": "/linker/viewer",
                "component": "viewer"
              },
              {
                "name": "微信通知配置",
                "link": "/member/notice/list"
              }
            ]
          },
          {
            "name": "评分表",
            "child": [
              {
                "name": "评分表模板",
                "link": "/sheet/list"
              },
              {
                "name": "评分表类型管理",
                "link": "/category/list"
              }
            ]
          },
          {
            "name": "任务管理",
            "child": [
              {
                "name": "考评任务",
                "link": "/task/list"
              },
              {
                "name": "随手拍",
                "link": "/snap/list"
              }
            ]
          },
          {
            "name": "项目管理",
            "child": [
              {
                "name": "单位列表",
                "link": "/company/list"
              },
              {
                "name": "项目列表",
                "link": "/project/list"
              },
              {
                "name": "任务计划",
                "link": "/schedule/list"
              }
            ]
          },
          {
            "name": "系统管理",
            "child": [
              {
                "name": "系统用户",
                "link": "/user/list"
              },
              {
                "name": "应用管理",
                "link": "/app/list"
              }
            ]
          }
        ],
        "index": "/home"
      },
      "type": "success",
      "user": {
        "avatar": "http://shangjie.neteast.cn/file/6wA9BPcqTjAHmSwFxooUi0GMIF",
        "expire": 0,
        "is_admin": true,
        "name": "林鱼丸"
      }
    }
  }
} as MockMethod