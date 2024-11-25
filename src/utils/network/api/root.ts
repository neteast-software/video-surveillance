import http from "../http";
import type { Login, MenuList } from "../types/root";

// 登录
export const login = async (username: string, password: string) => {
  const { data } = await http.post<{ data: Login }>("/login", {
    username,
    password,
  });
  return data.value!;
};
//登出
export const logout = async (username: string) => {
  const { data } = await http.post("/logout", { username });
  return data.value!;
};

//菜单列表
export const getMenuList = async () => {
  const { data } = await http.get<{ data: MenuList[] }>("/menu/getRouters");
  return data.value!;
};
