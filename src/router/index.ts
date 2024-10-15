import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

import { ref, nextTick, h } from "vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: () => import("../views/index/index.vue"),
    meta: {
      title: "首页",
      icon: () => h("div", { class: "i-icons:home  w-5 h-5" }),
    },
  },
  {
    path: "/deviceManagement",
    name: "deviceManagement",
    component: () => import("../views/deviceManagement/index.vue"),
    meta: {
      title: "设备管理",
      icon: () => h("div", { class: "i-icons:equipment  w-5 h-5" }),
    },
    children: [
      {
        path: "/deviceManagement/list",
        name: "list",
        component: () => import("../views/deviceManagement/list/index.vue"),
        meta: {
          title: "设备列表",
        },
      },
      {
        path: "/deviceManagement/message",
        name: "message",
        component: () => import("../views/deviceManagement/message/index.vue"),
        meta: {
          title: "设备信息",
        },
      },
    ],
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/dashboard/index.vue"),
    meta: {
      title: "综合看板",
      icon: () => h("div", { class: "i-icons:dashboard  w-5 h-5" }),
    },
  },

  {
    path: "/stautsMonitor",
    name: "stautsMonitor",
    component: () => import("../views/stautsMonitor/index.vue"),
    meta: {
      title: "状态监测",
      icon: () => h("div", { class: "i-icons:state  w-5 h-5" }),
    },
  },
  {
    path: "/systemSetting",
    name: "systemSetting",
    component: () => import("../views/systemSetting/index.vue"),
    meta: {
      title: "系统设置",
      icon: () => h("div", { class: "i-icons:settings  w-5 h-5" }),
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
