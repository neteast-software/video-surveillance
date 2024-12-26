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

	// 将动态路由添加到 router
	routes.value.forEach((route) => {
		router.addRoute(route);
	});

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
