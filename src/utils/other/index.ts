export function timeoutPromise(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clearUrl(url: string) {
  return url.replace(/([^:]\/)\/+/g, "$1");
}

export function NOOP() {}

export function removeEmptyKeys(obj?: Record<string, any>) {
  if (!obj) return;
  const result = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });
  return result;
}

export function isEmptyObject(obj?: Record<string, any>) {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

export function replaceLink(link: string, row: Record<string, any>) {
  return link.replace(/:(\w+)/g, (_, p1) => {
    return row?.[p1] || "";
  });
}

// export function arrayToTree<T>(array: T[], id = null, key = 'id', pidKey = 'pid', childrenKey = 'children') {
export function safeJSONParse(str: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export function arrayToTree<T>(
  array: T[] = [],
  pid = null,
  key = "id",
  pidKey = "pid",
  childrenKey = "children",
  labelKey = "regionName"
) {
  const tree: T[] = [];
  for (const item of array) {
    if (item[pidKey] === id) {
      const children = arrayToTree(array, item[key], key, pidKey, childrenKey);
      if (children.length) {
        item[childrenKey] = children;
      }
      tree.push(item);
    }
  }
  return tree;
}

export function downloadFile(data: Blob | string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = typeof data === "string" ? data : URL.createObjectURL(data);
  a.click();
  URL.revokeObjectURL(a.href);
}
