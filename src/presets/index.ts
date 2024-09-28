const isDev = process.env.NODE_ENV === "development";
/** 轮询间隔时间 */
export const intervalOfPoll = 3000;
export const baseUrl = isDev ? "/api" : "/";
export const timeout = 60000 * 5;
export const debounceTime = 200;
export const minWidthSize = 1455;

export const pollInterval = {
  rank1: 1000,
  rank2: 3000,
  rank3: 5000,
  rank4: 10000,
};
