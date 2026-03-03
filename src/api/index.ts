import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import fs from 'node:fs';
import path from "node:path";

import { writeLogFile } from "../utils/index.js";

// 定义响应数据的接口
interface ResponseData<T = unknown> {
    code: number;
    data: T;
    message: string;
}

const config: AxiosRequestConfig = {
    baseURL: 'https://console.portex.cloud',
    timeout: 10_000,
};

class RequestHttp {
    private service: AxiosInstance;

    public constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config);

        // 请求拦截器：注入 Authorization token
        this.service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                try {
                    const token = fs.readFileSync(
                        path.join(process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ as string),
                        'utf8'
                    );
                    if (config.method?.toLocaleLowerCase() === "put" && config.headers.has('x-amz-meta-authorization')) {
                        config.headers['x-amz-meta-authorization'] = `Bearer ${token}`;
                    } else {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    return Promise.reject(error);
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(this.normalizeError(error))
        );

        // 响应拦截器：统一错误处理
        this.service.interceptors.response.use(
            (response: AxiosResponse<ResponseData>) => response,
            (error: AxiosError) => Promise.reject(this.normalizeError(error))
        );
    }

    async delete<T>(url: string, params?: object, config: AxiosRequestConfig = {}): Promise<T> {
        const response = await this.service.delete<T>(url, { params, ...config });
        return response.data;
    }

    async get<T>(url: string, params?: object, config: AxiosRequestConfig = {}): Promise<T> {
        const response = await this.service.get<T>(url, { params, ...config });
        return response.data;
    }

    async post<T>(url: string, data?: object | string, config: AxiosRequestConfig = {}): Promise<T> {
        const response = await this.service.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: object, config: AxiosRequestConfig = {}): Promise<T> {
        const response = await this.service.put<T>(url, data, config);
        return response.data;
    }

    // 将 AxiosError 转换为带有可读 message 的标准 Error
    private normalizeError(error: AxiosError): Error {
        let message = 'Request failed';

        if (error.response) {
            switch (error.response.status) {
                case 401: message = 'TOKEN_EXPIRED'; break;
                case 403: message = 'ACCESS_DENIED'; break;
                case 404: message = 'NOT_FOUND'; break;
                case 500: message = 'SERVER_ERROR'; break;
                default:  message = `HTTP_${error.response.status}`;
            }
        } else if (error.request) {
            message = error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'NETWORK_ERROR';
        }

        writeLogFile(JSON.stringify(error, null, 2));
        return new Error(message);
    }
}

export default new RequestHttp(config);
