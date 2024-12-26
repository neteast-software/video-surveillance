import { RouteRecordRaw, RouteComponent } from "vue-router";
import { MenuList } from "../network/types/root";
import { h } from "vue";
import { lineSource } from "@/components/chart/LineChart.vue";
import { Viewer } from "linker-uii";

const componentMap: Record<string, RouteComponent> = {
	viewer: Viewer,
};

export function createRoutes(menuData: MenuList[]): RouteRecordRaw[] {
	const routes = menuData.map((menuItem) => {
		if (!menuItem.path || menuItem.path == "") {
			menuItem.path = menuItem.init.substring(1);
		}
		const mappingComponent = componentMap[menuItem.component!];
		const route = {
			path: `/${menuItem.path}`,
			name: menuItem.path ? menuItem.path : "",
			props: mappingComponent ? (r: any) => ({ key: r.path }) : undefined,
			meta: {
				title: menuItem.name,
				isFrame: menuItem?.isFrame,
				icon: () =>
					h("div", {
						class: `i-icons:${menuItem.icon.toLowerCase()} w-5 h-5`,
					}),
				uri: menuItem.init,
			},
			component: !menuItem.component
				? undefined
				: mappingComponent ||
				  (() => import(`@/views/${menuItem.component}/index.vue`)), // 动态导入组件
			children: menuItem.children
				? createRoutes(menuItem.children)
				: undefined,
		};

		return route;
	});

	return routes as unknown as RouteRecordRaw[];
}

export function createMenu(routes: any) {
	// if (!routes || routes.length === 0) return [];
	const routesFilter = routes.filter(
		(route: any) => route.name !== undefined
	);
	if (routesFilter.length === 0) return [];
	return routesFilter.map((route: any) => {
		const menuOption = {
			label: route.meta?.title || "",
			key: route.meta.isFrame === "0" ? route.meta.uri : route.path,
			icon: route.meta?.icon ? route.meta.icon : undefined,
			children: route.children ? createMenu(route.children) : undefined,
		};
		return menuOption;
	});
}

export function createLineChart(
	data: lineSource,
	xName?: string,
	yName?: string
) {
	const title = data?.title || "";
	const xAxis = data?.abscissa || [];
	// const xAxisDays = xAxis.map((date) => date.split("-")[2]);
	const dataList = data?.dataList || [];
	const items = dataList.map((item) =>
		Array.isArray(item.value)
			? [item.name, ...item.value]
			: [item.name, item.value]
	);
	let source = [[xName || title, ...xAxis], ...items];
	if (!xAxis.length) {
		const names = dataList.map((item) => item.name);
		const values = dataList.map((item) => item.value);
		source = [
			[xName || title, ...names],
			[yName || "数量", ...(values as number[])],
		];
	}

	return source;
}
