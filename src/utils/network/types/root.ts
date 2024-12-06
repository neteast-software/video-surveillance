export interface Login {
  userId: number;
  loginName: string;
  nickName: string;
  loginTime: string;
  access_token: string;
  expires_in: number;
}

export interface MenuList {
  id: number;
  parentId: number;
  icon: string;
  name: string;
  init: string;
  path: string;
  query: string;
  sort: number;

  isFrame: boolean;
  component?: string;
  children: MenuList[];
}
