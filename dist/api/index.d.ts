import { AxiosRequestConfig } from "axios";
declare module 'axios' {
    interface AxiosRequestConfig {
        loading?: boolean;
    }
}
declare class RequestHttp {
    private service;
    private spinner;
    constructor(config: AxiosRequestConfig);
    delete<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T>;
    get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: object | string, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T>;
    private handleError;
}
declare const _default: RequestHttp;
export default _default;
