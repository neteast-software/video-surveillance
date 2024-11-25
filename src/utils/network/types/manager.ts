import { TreeOption } from "naive-ui";
//角色列表
export interface RoleListItem {
  createBy: null;
  createTime: string;
  updateBy: null;
  updateTime: null;
  remark: string;
  roleId: number;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: string;
  menuCheckStrictly: boolean;
  deptCheckStrictly: boolean;
  status: string;
  delFlag: string;
  flag: boolean;
  menuIds: null;
  deptIds: null;
  permissions: null;
  admin: boolean;
  id: number;
}
export interface RoleList {
  data: RoleListItem[] | null;
}
//编辑角色
export interface EditRole {
  roleId: number;
  roleName: string;
}

//功能权限
export interface FunctionListItem extends TreeOption {
  regionIndexCode: string;
  parentIndexCode: string;
  sort: number;
  level: number;
  regionName: string;
  childrenList: FunctionListItem[];
  type: number;
}
export interface FunctionList {
  data: FunctionListItem[] | null;
}

//子系统权限
export interface SubSystemListItem {
  id: number;
  label: string;
  children: SubSystemListItem[];
}
export interface SubSystemList {
  data: SubSystemListItem[] | null;
}

//角色详情
export interface RoleDetailItem {
  functionChecked: number[];
  menuChecked: number[];
}
export interface RoleDetail {
  data: RoleDetailItem | null;
}
//角色权限保存
export interface SavePermissionParams {
  roleId: number;
  menuIds: number[];
  // functionPerList: { indexCode: string; type: number }[];
}
export interface FunctionTab {
  dictValue: string;
  dictLabel: string;
  sort: number;
  commitType: (string | number)[];
  cascade?: boolean;
}
