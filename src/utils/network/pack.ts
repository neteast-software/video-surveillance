// lock请求锁
// resend请求重发
// poll轮询
import http from './http';
import type { HttpReturn, RequestMethods, RequestOptions } from './http';

// const { data } = useFetch('aa');
// // poll轮询
// function usePack<T = any>(sender: HttpSender<T>, scope?: string) {
//     const lock = ref(false);
//     const data = ref();
//     async function send() {
//         lock.value = true;
//         try {
//             const { data: rawData } = await sender();
//             data.value = rawData.value;
//         } finally {
//             lock.value = false;
//         }
//     }
//     // async function poll() {
//     //     return useTimeoutPoll(send, 1000);
//     // }
//     return {
//         send,
//         data
//     };
// }
interface PackConfig {
    scope?: string;
}
class Pack {
    private headers: Record<string, string> = {};
    constructor(config: PackConfig) {
        const { scope } = config;
        if (scope) this.headers.scope = scope;
    }
    public get<T = any>(uri: string, query?: Record<string, any>, options?: RequestOptions): HttpReturn<T> {
        return this.fetch(uri, 'get', query, options);
    }
    public post<T = any>(uri: string, payload?: Record<string, any>, options?: RequestOptions): HttpReturn<T> {
        return this.fetch(uri, 'post', payload, options);
    }
    public put<T = any>(uri: string, payload?: Record<string, any>, options?: RequestOptions): HttpReturn<T> {
        return this.fetch(uri, 'put', payload, options);
    }
    public delete<T = any>(uri: string, payload?: Record<string, any>, options?: RequestOptions): HttpReturn<T> {
        return this.fetch(uri, 'delete', payload, options);
    }
    public fetch<T = any>(
        uri: string,
        method: RequestMethods = 'get',
        params?: Record<string, any>,
        options?: RequestOptions
    ): HttpReturn<T> {
        return http.fetch(uri, method, params, { ...options, headers: { ...options?.headers, ...this.headers } });
    }
}

export default Pack;
