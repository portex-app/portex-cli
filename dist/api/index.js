import axios from "axios";
import fs from 'node:fs';
import path from "node:path";
import ora from 'ora';
import { writeLogFile } from "../utils/index.js";
// 定义请求配置
const config = {
    baseURL: 'https://console.portex.cloud',
    loading: true, // 默认显示 loading
    timeout: 10_000,
};
class RequestHttp {
    service;
    spinner;
    constructor(config) {
        this.spinner = ora();
        this.service = axios.create(config);
        // 请求拦截器
        this.service.interceptors.request.use((config) => {
            try {
                const token = fs.readFileSync(path.join(process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_), 'utf8');
                if (config.method?.toLocaleLowerCase() === "put" && config.headers.has('x-amz-meta-authorization')) {
                    config.headers['x-amz-meta-authorization'] = `Bearer ${token}`;
                }
                else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            catch (error) {
                this.spinner.fail('Failed to read token file');
                return Promise.reject(error);
            }
            // 只在配置中不明确禁用 loading 时显示
            if (config.loading !== false) {
                this.spinner.start('Processing your request...');
            }
            return config;
        }, (error) => {
            this.handleError(error);
            return Promise.reject(error);
        });
        // 响应拦截器
        this.service.interceptors.response.use((response) => {
            if (response.config.loading !== false) {
                this.spinner.stop();
            }
            return response;
        }, (error) => {
            if (error.config?.loading !== false) {
                this.spinner.stop();
            }
            this.handleError(error);
            return Promise.reject(error);
        });
    }
    async delete(url, params, config = {}) {
        const response = await this.service.delete(url, { params, ...config });
        return response.data;
    }
    async get(url, params, config = {}) {
        const response = await this.service.get(url, { params, ...config });
        return response.data;
    }
    async post(url, data, config = {}) {
        const response = await this.service.post(url, data, config);
        return response.data;
    }
    async put(url, data, config = {}) {
        const response = await this.service.put(url, data, config);
        return response.data;
    }
    handleError(error) {
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
        }
        else if (error.request) {
            // 请求已发出但没有收到响应
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout';
            }
            else {
                errorMessage = 'Network error: No response received';
            }
        }
        else {
            // 请求配置错误
            errorMessage = `Request error: ${error.message}`;
        }
        this.spinner.fail(errorMessage);
        // 记录错误日志
        writeLogFile(JSON.stringify(error, null, 2));
    }
}
export default new RequestHttp(config);
