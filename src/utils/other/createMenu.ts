import {
  RouterLink,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import type { IconifyIcon } from "@iconify/vue";
import { Icon } from "@iconify/vue";
import { h } from "vue";
export function renderIcon(iconSrc: string) {
  // return () => h(Image, { src: iconSrc, alt: "", width: 24, height: 24 });
}

export function createMenu(routes) {
  return routes.map((route) => {
    const menuOption = {
      label: route.meta.title,
      key: route.name,
      icon: route.meta.icon ? renderIcon(route.meta.icon) : undefined,
      children: route.children ? createMenu(route.children) : undefined,
    };
    console.log("菜单", menuOption);

    return menuOption;
  });
}
