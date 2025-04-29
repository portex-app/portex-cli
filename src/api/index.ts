import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import fs from 'node:fs';
import path from "node:path";
import ora, { Ora } from 'ora';

import { writeLogFile } from "../utils/index.js";

// 扩展 Axios 配置类型
declare module 'axios' {
    interface AxiosRequestConfig {
        loading?: boolean;
    }
}

// 定义响应数据的接口
interface ResponseData<T = unknown> {
    code: number;
    data: T;
    message: string;
}

// 定义请求配置
const config: AxiosRequestConfig = {
    baseURL: 'https://console.portex.cloud',
    loading: true, // 默认显示 loading
    timeout: 10_000,
};

class RequestHttp {
    private service: AxiosInstance;
    private spinner: Ora;

    public constructor(config: AxiosRequestConfig) {
        this.spinner = ora();
        this.service = axios.create(config);

        // 请求拦截器
        this.service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                try {
                    const token = fs.readFileSync(path.join(process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ as string), 'utf8');
                    if (config.method?.toLocaleLowerCase() === "put" && config.headers.has('x-amz-meta-authorization')) {
                        config.headers['x-amz-meta-authorization'] = `Bearer ${token}`;
                    } else {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    this.spinner.fail('Failed to read token file');
                    return Promise.reject(error);
                }

                // 只在配置中不明确禁用 loading 时显示
                if (config.loading !== false) {
                    this.spinner.start('Processing your request...');
                }

                return config;
            },
            (error: AxiosError) => {
                this.handleError(error);
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.service.interceptors.response.use(
            (response: AxiosResponse<ResponseData>) => {
                if (response.config.loading !== false) {
                    this.spinner.stop();
                }

                return response;
            },
            (error: AxiosError) => {
                if (error.config?.loading !== false) {
                    this.spinner.stop();
                }

                this.handleError(error);
                return Promise.reject(error);
            }
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

    private handleError(error: AxiosError): void {
        let errorMessage = 'Request failed';

        if (error.response) {
            // 服务器响应错误
            switch (error.response.status) {
                case 401: {
                    errorMessage = 'Token expired. Please execute "portex login" to obtain a new token.';
                    break;
                }

                case 403: {
                    errorMessage = 'Access denied';
                    break;
                }

                case 404: {
                    errorMessage = 'Resource not found';
                    break;
                }

                case 500: {
                    errorMessage = 'Server error';
                    break;
                }

                default: {
                    errorMessage = `Request failed with status ${error.response.status}`;
                }
            }
        } else if (error.request) {
            // 请求已发出但没有收到响应
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout';
            } else {
                errorMessage = 'Network error: No response received';
            }
        } else {
            // 请求配置错误
            errorMessage = `Request error: ${error.message}`;
        }

        this.spinner.fail(errorMessage);

        // 记录错误日志
        writeLogFile(JSON.stringify(error, null, 2));
    }
}

export default new RequestHttp(config);
