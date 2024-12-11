import {
	createRouter,
	createWebHashHistory,
	type RouteRecordRaw,
} from "vue-router";
import storage from "@/utils/other/storage";
import { getMenuList } from "@/utils/network/api/root";
// import { login } from "@/utils/network/api/root";
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
	routes: [
		{ path: "/", redirect: "/homePage" },
		{
			path: "/login",
			name: "login",
			component: () => import("../views/login/index.vue"),
			meta: {
				title: "登陆",
				singlePage: true,
			},
		},
		{
			path: "/binding",
			name: "binding",
			component: () => import("../views/binding/index.vue"),
			meta: {
				title: "绑定账号",
				singlePage: true,
			},
		},
		{
			path: "/buildBinding",
			name: "buildBinding",
			component: () => import("../views/binding/index2.vue"),
			meta: {
				title: "网页授权",
				singlePage: true,
			},
		},
		// {
		//   path: "/homePage",
		//   name: "homePage",
		//   component: () => import("../views/homePage/index.vue"),
		//   meta: {
		//     title: "123",
		//     singlePage: true,
		//   },
		// },
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
const whiteList = ["login", "binding", "buildBinding", "homePage"];
export const hasGetRouter = shallowRef();
router.beforeEach(async (to, _, next) => {
	if (window.top !== window.self) {
		return;
	}
	if (to.meta?.bypassAuth) {
		return next();
	}
	const token = storage.get<string>("access_token");
	if (!token) {
		// try {
		//   await initLogin(); // 等待登录完成
		// } catch (error) {
		//   console.error("登录失败:", error);
		//   return next("/login"); // 或者重定向到登录页面
		// }
		// console.error("登录失败:", error);
		// router.push("/login"); // 或者重定向到登录页面
		if (!whiteList.includes(to.name as string)) {
			return next("/login");
		}
		return next();
	} else {
		if (to.name === "login") {
			return next("/index");
		}
	}
	if (hasGetRouter.value) return next();
	// 动态加载系统路由
	const { data } = await getMenuList();
	routes.value = createRoutes(data); // 更新动态路由
	menuOptions.value = createMenu(routes.value);
	console.log(2222);

	console.log(menuOptions.value);
	// 将动态路由添加到 router
	routes.value.forEach((route) => {
		router.addRoute(route);
	});
	console.log(123);

	console.log(router);
	console.log(to);
	hasGetRouter.value = true; // 设置标志，防止重复加载
	next({ ...to }); // 继续导航
});

export function clearRoute() {
	hasGetRouter.value = false;
	routes.value.forEach((route) => {
		router.removeRoute(route.name as string);
	});
}
export default router;
