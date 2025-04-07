import Http from "../../index.js";
/**
 * @description 创建应用
 * @param params 创建应用参数
 * @returns {Promise<void>} void
 */
export const apiCreateApplication = async (params) => Http.post('/v1/applications', params);
/**
 * @description 获取应用列表
 * @returns 应用列表
 */
export const apiGetApplicationList = async (params) => Http.post(`/v1/applications/query`, params);
/**
 * @description 获取应用详情
 * @param {string} applicationId - 应用ID
 * @returns  应用信息
 */
export const apiGetApplicationDetail = async (applicationId) => Http.get(`/v1/applications/${applicationId}`);
/**
 * @description 获取应用上传地址
 * @param {string} applicationId - 应用ID
 * @param {string} md5 文件md5
 * @returns 返回上传地址
 */
export const apiGetPreUploadUrl = async (applicationId, md5, description) => Http.post(`/v1/applications/${applicationId}/pre-upload`, {
    description,
    md5
});
/**
 * @description 上传压缩包
 */
export const apiPutCompressFile = (params) => {
    const { description, file, md5, onUploadProgress, url } = params;
    const request_header = {
        "Content-MD5": md5,
        "Content-Type": "application/zip",
        "x-amz-meta-authorization": '',
    };
    if (description) {
        request_header["x-amz-meta-description"] = encodeURIComponent(description);
    }
    return Http.put(url, file, {
        headers: request_header,
        onUploadProgress
    });
};
