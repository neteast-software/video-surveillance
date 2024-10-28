import { RouteRecordRaw } from "vue-router";
import { MenuList } from "../network/types/root";
import { h } from "vue";

// 递归处理菜单数据
export function createRoutes(menuData: MenuList[]): RouteRecordRaw[] {
  return menuData.map((menuItem) => {
    const route = {
      path: menuItem.path ? `/${menuItem.path}` : "",
      name: menuItem.path ? menuItem.path : "",
      meta: {
        title: menuItem.name,
        icon: () => h("div", { class: `i-icons:${menuItem.icon}  w-5 h-5` }),
      },
      // component: () => import(`../views/${menuItem.component}.vue`), // 动态导入组件
      component: () => import(`@/views/${menuItem.component}/index.vue`), // 动态导入组件
      children: menuItem.children ? createRoutes(menuItem.children) : null,
    };
    return route;
  });
}

export function createMenu(routes: any) {
  // if (!routes || routes.length === 0) return [];
  console.log("111111", routes);
  const routesFilter = routes.filter((route: any) => route.name !== undefined);
  if (routesFilter.length === 0) return [];
  return routesFilter.map((route: any) => {
    const menuOption = {
      label: route.meta?.title || "",
      key: route.path,
      icon: route.meta?.icon ? route.meta.icon : undefined,
      children: route.children ? createMenu(route.children) : undefined,
    };
    return menuOption;
  });
}
