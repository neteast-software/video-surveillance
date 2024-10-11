import { TreeOption } from "naive-ui";
export const treeData: TreeOption[] = [
  {
    label: "双园道路前段",
    key: "0",
    children: [
      {
        label: "双园道路前段1",
        key: "双园道路前段1",
        children: [
          { label: "双园道路前段1-1", key: "双园道路前段1-1" },
          { label: "双园道路前段1-2", key: "双园道路前段1-2" },
        ],
      },
      {
        label: "0-1",
        key: "0-1",
        children: [
          { label: "0-1-0", key: "0-1-0" },
          { label: "0-1-1", key: "0-1-1" },
        ],
      },
    ],
  },
  {
    label: "双园道路前段",
    key: "1",
    children: [
      {
        label: "双园道路前段1",
        key: "1-0",
        children: [
          { label: "双园道路前段", key: "1-0-0" },
          { label: "双园道路前段", key: "1-0-1" },
        ],
      },
      {
        label: "1-1",
        key: "1-1",
        children: [
          { label: "1-1-0", key: "1-1-0" },
          { label: "1-1-1", key: "1-1-1" },
        ],
      },
    ],
  },
  {
    label: "双园道路前段",
    key: "2",
    children: [
      {
        label: "双园道路前段1",
        key: "2-0",
        children: [
          { label: "双园道路前段", key: "2-0-0" },
          { label: "双园道路前段", key: "2-0-1" },
        ],
      },
      {
        label: "2-1",
        key: "2-1",
        children: [
          { label: "2-1-0", key: "2-1-0" },
          { label: "2-1-1", key: "2-1-1" },
        ],
      },
    ],
  },
];
