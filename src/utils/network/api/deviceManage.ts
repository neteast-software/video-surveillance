import http from "../http";
import type { TreeList } from "../types/deviceManage";

//地区树
export const getTreeList = async () => {
  const { data } = await http.get<{ data: TreeList[] }>("/area/treeList");
  return data.value!;
};
