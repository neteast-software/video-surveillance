export interface TreeList {
  id: number;
  name: string;
  parentId: number;
  path: string;
  fullName: string;
  level: number;
  code: string | null;
  sort: number;
  children: TreeList[];
}
