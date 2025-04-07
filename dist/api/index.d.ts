import { AxiosRequestConfig } from "axios";
declare class RequestHttp {
    private service;
    private spinner;
    constructor(config: AxiosRequestConfig);
    delete<T>(url: string, params?: object, _object?: {}): Promise<T>;
    get<T>(url: string, params?: object, _object?: {}): Promise<T>;
    post<T>(url: string, params?: object | string, _object?: {}): Promise<T>;
    put<T>(url: string, params?: object, _object?: {}): Promise<T>;
}
declare const _default: RequestHttp;
export default _default;
