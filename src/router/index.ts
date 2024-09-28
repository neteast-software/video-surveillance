import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import homeImg from "../Icons/home.svg";
import equipmentImg from "../Icons/equipment.svg";
import dashboardImg from "../Icons/dashboard.svg";
import stateImg from "../Icons/state.svg";
import settingsImg from "../Icons/settings.svg";

import { ref, nextTick } from "vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/index",
    name: "index",
    component: () => import("../views/index/index.vue"),
    meta: {
      title: "首页",
      icon: homeImg,
    },
  },
  {
    path: "",
    name: "deviceManagement",
    component: () => import("../views/deviceManagement/index.vue"),
    meta: {
      title: "设备管理",
      icon: equipmentImg,
    },
    children: [
      {
        path: "/list",
        name: "list",
        component: () => import("../views/index/index.vue"),
        meta: {
          title: "设备列表",
          icon: "",
        },
      },
      {
        path: "/message",
        name: "message",
        component: () => import("../views/index/index.vue"),
        meta: {
          title: "设备信息",
          icon: "",
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
      icon: dashboardImg,
    },
  },

  {
    path: "/",
    name: "statusMonitoring",
    component: () => import("../views/index/index.vue"),
    meta: {
      title: "状态监测",
      icon: stateImg,
    },
  },
  {
    path: "/",
    name: "systemSettings",
    component: () => import("../views/index/index.vue"),
    meta: {
      title: "系统设置",
      icon: settingsImg,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
