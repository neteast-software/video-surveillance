import { useFetch, createFetch, UseFetchReturn } from "@vueuse/core";
import type { BeforeFetchContext } from "@vueuse/core";
import { Ref, unref, watch, reactive } from "vue";
import { clearUrl } from "../other";
import { baseUrl, timeout } from "@/presets";
import storage from "../other/storage";
import { encrypt, md5 } from "../crypto";
// import { ElNotification } from 'element-plus';

// const baseUrl = 'http://192.168.3.106:8080';
// const baseUrl = '/api';
// const baseUrl = 'http://127.0.0.1:8080';
// const { data } = useFetch('1', {});
const invalidMethods = [
  "get",
  "GET",
  "post",
  "POST",
  "put",
  "PUT",
  "delete",
  "DELETE",
] as const;
export type RequestMethods = (typeof invalidMethods)[number];
interface RequestorConfig {
  baseUrl: string;
  timeout?: number;
}
interface ResponseData {
  code?: number;
  msg?: string;
  data?: unknown;
  [key: string]: unknown;
}
export interface RequestOptions extends RequestInit {
  withoutLock?: boolean;
  isSync?: boolean;
  needAuth?: boolean;
}
// const {} = useFetch();
export type HttpReturn<T> = Promise<UseFetchReturn<T>>;
// type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
interface RequestPack<T> {
  request: () => Promise<{
    result: UseFetchReturn<any>;
    p: Promise<undefined>;
  }>;
  resolve: (value: HttpReturn<T> | PromiseLike<HttpReturn<T>>) => void;
  reject: (reason?: any) => void;
}
class Requestor {
  private useRequest: typeof useFetch;
  private baseUrl: string;
  private locks: Record<string, boolean> = {};
  private series = reactive({
    asyncLock: false,
    queue: [] as RequestPack<any>[],
  });
  constructor(config: RequestorConfig) {
    const { baseUrl, timeout } = config;

    this.baseUrl = new URL(baseUrl, location.origin).href;
    const { beforeFetch } = this;
    this.useRequest = createFetch({
      options: {
        timeout: timeout || 60000 * 5,
        refetch: false,
        beforeFetch,
        onFetchError: (ctx) => {
          const { data } = ctx;
          window.$notification?.error({
            title: "请求异常",
            content: data?.msg,
            duration: 2000,
          });
          return ctx;
        },
      },
    });
    watch(
      () => this.series,
      async (series) => {
        const { asyncLock, queue } = series;
        if (asyncLock) return;
        if (!queue.length) return;
        const { request, resolve, reject } = queue.shift()!;
        try {
          this.series.asyncLock = true;
          const { result, p } = await request();
          await p;
          resolve(result as any);
        } catch (error) {
          reject(error);
        } finally {
          this.series.asyncLock = false;
        }
      },
      { deep: true }
    );
  }
  private beforeFetch(
    ctx: BeforeFetchContext
  ):
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>
    | void {
    const { options } = ctx;
    const accessToken = storage.get<string>("access_token");
    // const accessToken =
    //     'eyJhbGciOiJIUzUxMiJ9.eyJ1aWQiOjEsInVzZXJfa2V5IjoiYWY0MTFmMjgtYzlkNi00Y2EyLWE0YzItMTY1NjA5ODhkZGZiIiwidXNlcm5hbWUiOiJhZG1pbiJ9.kMLNl6iXZ3G4EqyLm_06mGz6cQYeWv23eAo8XTHhrpgs7epI5BliQkS_8Hp8Jl9mcRKsJRYxORPEmpzYxd8wiw';
    // const accessToken =
    //     'eyJhbGciOiJIUzUxMiJ9.eyJ1aWQiOjEsInVzZXJfa2V5IjoiNzM4ZmIxYTItZTRhNy00OTFkLWIxZmEtOWVkYjk0Yzk2MTdiIiwidXNlcm5hbWUiOiJhZG1pbiJ9.lYPDO59WXTNE85UpFzzlcYu0pNfGdr626RXEPDDQV0jLWhLvVcaGxrmeyLIe-Ay4PEAlhr1Gfk3cnWmsjFI_bw';
    options.headers = {
      ...options.headers,
      Authorization: accessToken ? `${accessToken}` : "",
    };
    return {
      options,
    };
  }
  private getUrl(uri: string, query?: Record<string, any>) {
    // const url = new URL(`${this.baseUrl}/${uri}`);
    const queryStr = new URLSearchParams(query).toString() || "";
    const joiner = uri.includes("?") ? "&" : "?";
    const url = `${this.baseUrl}/${uri}${queryStr && joiner + queryStr}`;
    return clearUrl(url);
  }
  public get<T = any>(
    uri: string,
    query?: Record<string, any>,
    options?: RequestOptions
  ): HttpReturn<T> {
    return this.fetch(uri, "get", query, options);
  }
  public post<T = any>(
    uri: string,
    payload?: Record<string, any>,
    options?: RequestOptions
  ): HttpReturn<T> {
    return this.fetch(uri, "post", payload, options);
  }
  public put<T = any>(
    uri: string,
    payload?: Record<string, any>,
    options?: RequestOptions
  ): HttpReturn<T> {
    return this.fetch(uri, "put", payload, options);
  }
  public delete<T = any>(
    uri: string,
    payload?: Record<string, any>,
    options?: RequestOptions
  ): HttpReturn<T> {
    return this.fetch(uri, "delete", payload, options);
  }
  private async preFetch<T = any>(
    uri: string,
    method: RequestMethods = "get",
    params?: Record<string, any>,
    options?: RequestOptions
  ) {
    const lowerMethod = method.toLowerCase() as
      | "get"
      | "post"
      | "put"
      | "delete";
    if (!invalidMethods.includes(lowerMethod))
      return Promise.reject("网络请求方法错误");
    const url =
      lowerMethod === "get"
        ? this.getUrl(uri, unref(params))
        : this.getUrl(uri);
    const payload = lowerMethod === "get" ? undefined : unref(params);
    const requestKey = md5({ ...payload, url });
    const request = async () => {
      const result = await this.useRequest<T>(url, { ...options })
        [lowerMethod](payload)
        .json();
      //  console.log(result)
      const p = this.postFetch<any>(result);
      return { result, p };
    };
    //   console.log(request())
    return { requestKey, request };
  }
  public async fetch<T = any>(
    uri: string,
    method: RequestMethods = "get",
    params?: Record<string, any>,
    options?: RequestOptions
  ): HttpReturn<T> {
    const { request, requestKey } = await this.preFetch<T>(
      uri,
      method,
      params,
      options
    );
    const { withoutLock, isSync } = options || {};
    if (isSync) {
      return new Promise<HttpReturn<T>>((resolve, reject) => {
        this.series.queue.push({ request, resolve, reject });
      });
    }
    if (!withoutLock) {
      if (this.locks[requestKey]) {
        return Promise.reject("重复的请求，请稍后");
      }
      this.locks[requestKey] = true;
    }
    const { result, p } = await request();
    p.finally(() => {
      delete this.locks[requestKey];
    });
    await p;
    return result;
  }
  // public async fetch<T = any>(
  //     uri: string,
  //     method: RequestMethods = 'get',
  //     params?: Record<string, any>,
  //     options?: RequestOptions
  // ): HttpReturn<T> {
  //     const lowerMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
  //     if (!invalidMethods.includes(lowerMethod)) return Promise.reject('网络请求方法错误');
  //     const url = lowerMethod === 'get' ? this.getUrl(uri, unref(params)) : this.getUrl(uri);
  //     const payload = lowerMethod === 'get' ? undefined : unref(params);
  //     console.log('请求', url, payload);
  //     const requestKey = md5({ ...payload, url });
  //     const { withoutLock } = options || {};
  //     if (!withoutLock) {
  //         if (this.locks[requestKey]) {
  //             return Promise.reject('重复的请求，请稍后');
  //         }
  //         this.locks[requestKey] = true;
  //     }
  //     const result = await this.useRequest<T>(url, { ...options })
  //         [lowerMethod](payload)
  //         .json();
  //     const p = this.postFetch<any>(result);
  //     p.finally(() => {
  //         delete this.locks[requestKey];
  //     });
  //     await p;
  //     return result;
  // }
  private async postFetch<T extends ResponseData>(result: UseFetchReturn<T>) {
    const { data, error, response } = result;
    // result.onFetchError((res) => {
    //     console.log('请求错', res);
    // });
    if (error.value) {
      console.log("请求错误", data.value, error.value, response.value);
      // 处理错误
      return Promise.reject(error.value);
    }
    // 处理响应
    await this.onFetchResponse(response.value!, data);
  }
  private async onFetchResponse<T extends ResponseData>(
    response: Response,
    data: Ref<T | null>
  ) {
    const { status } = response;
    if (status === 200 || status < 300 || status === 304) {
      if (!data.value) return data;
      const { code } = data.value;
      let ret: any = data.value;

      switch (code) {
        case 200:
        case 0:
          if (ret?.type === "success" && ret?.msg) {
            // window.$notification?.success({
            //     title: '成功',
            //     content: ret.msg,
            //     duration: 2200
            // });
            window.$message?.success(ret.msg);
          }
          delete ret.msg;
          delete ret.code;
          break;
        case 401:
          ret = Promise.reject("未登录");
          // router.push('/login');
          break;
        case 402:
          ret = Promise.reject(ret.error || "发生异常");
          break;
        default:
          // window.$notification?.create({
          //     type: ret?.type || 'error',
          //     title: '请求异常',
          //     content: ret.msg || '系统异常',
          //     duration: 2200
          // });
          window.$message?.create(ret.msg, {
            type: ret?.type || "error",
          });
          ret = Promise.reject(ret.msg);
          break;
      }
      return ret;
    }
    return Promise.reject("失败");
  }
}

const http = new Requestor({
  baseUrl,
  timeout,
});

export default http;
