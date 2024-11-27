import http from "../http";

/** 构造网页授权url   /wechatMp/oAuth2/buildAuthorizationUrl*/
export const buildAuthorizationUrl = async () => {
  // https://road228.neteast.cn/view/index.html#/
  const { data: res } = await http.get<{ data: any }>(
    "/wechatMp/oAuth2/buildAuthorizationUrl",
    { url: "https://road228.neteast.cn/view/index.html#/binding" }
  );
  return res.value!;
};

/** 获取授权token  /wechatMp/oAuth2/ */
export const getAuthorizationToken = async (code: string) => {
  const { data: res } = await http.get<{ data: any }>("/wechatMp/oAuth2", {
    code,
  });
  return res.value!;
};

/** 绑定账号 /wechatMp/oAuth2/bind */
export const bindAccount = async (data: {
  loginName: string;
  phonenumber: string;
}) => {
  const { data: res } = await http.post("/wechatMp/oAuth2/bind", data);
  return res.value!;
};
