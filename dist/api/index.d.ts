import { AxiosRequestConfig } from "axios";
declare class RequestHttp {
    private service;
    constructor(config: AxiosRequestConfig);
    delete<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T>;
    get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: object | string, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T>;
    private normalizeError;
}
declare const _default: RequestHttp;
export default _default;
