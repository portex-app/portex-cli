import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import fs from 'node:fs';
import path from "node:path";
import ora, { Ora } from 'ora';

import { writeLogFile } from "../utils/index.js";

const config = {
    // 默认地址请求地址
    baseURL: 'https://console.portex.cloud',
};

class RequestHttp {
    private service: AxiosInstance;
    private spinner: Ora;

    public constructor(config: AxiosRequestConfig) {
        this.spinner = ora(); // 初始化spinner
        // instantiation
        this.service = axios.create(config);

        /**
         * @description 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         */
        this.service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = fs.readFileSync(path.join(process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ as string), 'utf8');
                if (config.method?.toLocaleLowerCase() === "put" && config.headers.has('x-amz-meta-authorization')) {
                    config.headers['x-amz-meta-authorization'] = `Bearer ${token}`
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // 开始请求时启动spinner
                this.spinner.start('Processing your request...');
                return config;
            },
            error => Promise.reject(error)
        )

        /**
         * @description 响应拦截器
         *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                this.spinner.stop();
                return response.data
            },
            error => {
                this.spinner.stop();
                let errorMessage = 'Failed';
                if (error.response.status === 401) {
                    this.spinner.fail(`The token has expired. Please execute the command 'portex login' to obtain a new token.`);
                }
                else if (error.response) {
                    errorMessage = `Error: ${JSON.stringify(error.response.data)}`;
                } else if (error.request) {
                    // 请求已发出，但没有收到响应
                    errorMessage = 'No response received';
                } else {
                    // 发生了一些设置请求时的错误
                    errorMessage = error.message;
                }

                this.spinner.fail(errorMessage);
                writeLogFile(JSON.stringify(error));
                return Promise.reject(errorMessage);
            }

        )
    }

    /*
    * @description 新增的delete请求方法封装
    * @returns Promise
    */
    delete<T>(url: string, params?: object, _object = {}): Promise<T> {
        return this.service.delete(url, { params, ..._object });
    }

    /*
     * @description 常用请求方法封装
     * @returns Promise
     */
    get<T>(url: string, params?: object, _object = {}): Promise<T> {
        return this.service.get(url, { params, ..._object });
    }

    /*
     * @description 常用请求方法封装
     * @returns Promise
     */
    post<T>(url: string, params?: object | string, _object = {}): Promise<T> {
        return this.service.post(url, params, _object);
    }

    /*
     * @description 常用请求方法封装
     * @returns Promise
     */
    put<T>(url: string, params?: object, _object = {}): Promise<T> {
        return this.service.put(url, params, _object);
    }
}

export default new RequestHttp(config);
