import http from "../http";

/** 角色列表 /role/list */
export const getRoleList = async () => {
  const { data } = await http.get<{ data: any[] }>("/role/list");
  return data.value!;
};

/** 添加角色 /role/save */
export const addRole = async (data: any) => {
  await http.post("/role/save", { roleName: data });
};
/** 修改角色 /role/modify*/
export const modifyRole = async (data: any) => {
  await http.put("/role/modify", data);
};
/** 删除角色  /role/delete/{id} */
export const deleteRole = async (id: number) => {
  await http.delete(`/role/delete/${id}`);
};
/** 菜单树 /menu/getMenuTree */
export const getMenuTree = async () => {
  const { data } = await http.get<{ data: any[] }>("/menu/getMenuTree");
  return data.value!;
};
/** 角色已选择的菜单id /role/selectMenuId/{roleId} */
export const getRoleMenu = async (roleId: number) => {
  const { data } = await http.get<{ data: any[] }>(
    `/role/selectMenuId/${roleId}`
  );
  return data.value!;
};
/** 保存角色菜单 /role/saveRoleMenu */
export const saveRoleMenu = async (data: any) => {
  await http.post("/role/saveRoleMenu", data);
};
