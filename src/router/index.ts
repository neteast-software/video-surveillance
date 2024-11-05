import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import storage from "@/utils/other/storage";
import { getMenuList } from "@/utils/network/api/root";
import { login } from "@/utils/network/api/root";
import type { MenuList } from "@/utils/network/types/root";
import { ref, reactive, h, shallowRef } from "vue";
import { createMenu, createRoutes } from "@/utils/other/create";

// export const routes: RouteRecordRaw[] = [
//   {
//     path: "/",
//     redirect: "/index",
//   },
//   {
//     path: "/index",
//     name: "index",
//     component: () => import("../views/index/index.vue"),
//     meta: {
//       title: "首页",
//       icon: () => h("div", { class: "i-icons:home  w-5 h-5" }),
//     },
//   },
//   {
//     path: "/deviceManagement",
//     name: "deviceManagement",
//     component: () => import("../views/deviceManagement/index.vue"),
//     meta: {
//       title: "设备管理",
//       icon: () => h("div", { class: "i-icons:equipment  w-5 h-5" }),
//     },
//     children: [
//       {
//         path: "/deviceManagement/list",
//         name: "list",
//         component: () => import("../views/deviceManagement/list/index.vue"),
//         meta: {
//           title: "设备列表",
//         },
//       },
//       {
//         path: "/deviceManagement/message",
//         name: "message",
//         component: () => import("../views/deviceManagement/message/index.vue"),
//         meta: {
//           title: "设备信息",
//         },
//       },
//     ],
//   },
//   {
//     path: "/dashboard",
//     name: "dashboard",
//     component: () => import("../views/dashboard/index.vue"),
//     meta: {
//       title: "综合看板",
//       icon: () => h("div", { class: "i-icons:dashboard  w-5 h-5" }),
//     },
//   },

//   {
//     path: "/stautsMonitor",
//     name: "stautsMonitor",
//     component: () => import("../views/stautsMonitor/index.vue"),
//     meta: {
//       title: "状态监测",
//       icon: () => h("div", { class: "i-icons:state  w-5 h-5" }),
//     },
//   },
//   {
//     path: "/systemSetting",
//     name: "systemSetting",
//     component: () => import("../views/systemSetting/index.vue"),
//     meta: {
//       title: "系统设置",
//       icon: () => h("div", { class: "i-icons:settings  w-5 h-5" }),
//     },
//   },
// ];

export const menuOptions = shallowRef();
export const routes = shallowRef<RouteRecordRaw[]>([]);
const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: "/", redirect: "/index" },
    // {
    //   path: "/dashboard",
    //   name: "dashboard",
    //   component: () => import("../views/dashboard/index.vue"),
    //   meta: {
    //     title: "综合看板",
    //     icon: () => h("div", { class: "i-icons:dashboard  w-5 h-5" }),
    //   },
    // },
  ],
});
let hasGetRouter = false;
router.beforeEach(async (to, _, next) => {
  if (window.top !== window.self) {
    return;
  }
  if (to.meta?.bypassAuth) {
    return next();
  }
  const token = storage.get<string>("access_token");
  if (!token) {
    try {
      await initLogin(); // 等待登录完成
    } catch (error) {
      console.error("登录失败:", error);
      // return next("/login"); // 或者重定向到登录页面
    }
  }
  if (hasGetRouter) return next();
  // 动态加载系统路由
  const { data } = await getMenuList();
  routes.value = createRoutes(data); // 更新动态路由
  menuOptions.value = createMenu(routes.value);
  // 将动态路由添加到 router
  routes.value.forEach((route) => {
    router.addRoute(route);
  });
  hasGetRouter = true; // 设置标志，防止重复加载
  next({ ...to }); // 继续导航
});

//登录
const formData = reactive({
  username: "admin",
  password: "admin123",
});
async function initLogin() {
  // storage.remove("access_token");
  const { username, password } = formData;
  const { data } = await login(username, password);
  storage.set("access_token", data.access_token);
}

export default router;
