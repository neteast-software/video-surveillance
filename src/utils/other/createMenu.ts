export function createMenu(routes: any) {
  return routes.map((route: any) => {
    const menuOption = {
      label: route.meta.title,
      key: route.path,
      icon: route.meta.icon ? route.meta.icon : undefined,
      children: route.children ? createMenu(route.children) : undefined,
    };
    return menuOption;
  });
}
