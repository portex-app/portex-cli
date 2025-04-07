/**
 * @description 创建应用
 * @param params 创建应用参数
 * @returns {Promise<void>} void
 */
export declare const apiCreateApplication: (params: CreateApplicationRequest) => Promise<void>;
/**
 * @description 获取应用列表
 * @returns 应用列表
 */
export declare const apiGetApplicationList: (params?: ApplicationQueryRequest) => Promise<ApplicationQueryResponse>;
/**
 * @description 获取应用详情
 * @param {string} applicationId - 应用ID
 * @returns  应用信息
 */
export declare const apiGetApplicationDetail: (applicationId: string) => Promise<Application>;
/**
 * @description 获取应用上传地址
 * @param {string} applicationId - 应用ID
 * @param {string} md5 文件md5
 * @returns 返回上传地址
 */
export declare const apiGetPreUploadUrl: (applicationId: string, md5: string, description: string) => Promise<{
    url: string;
}>;
/**
 * @description 上传压缩包
 */
export declare const apiPutCompressFile: (params: DeployUploadParams) => Promise<unknown>;
