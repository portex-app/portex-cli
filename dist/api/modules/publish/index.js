import Http from "../../index.js";
/**
 * @description 发布应用
 * @param params 发布应用参数
 */
export const apiPublishApplication = async (params) => {
    const url = `/v1/applications/${params.application_id}/versions/${params.version_number}/publish`;
    return Http.post(url, params.PublishApplicationVersionRequest);
};
/**
 * @description 下架应用
 * @param params 下架应用参数
 * @returns {Promise<void>}
 */
export const apiUnPublishApplication = async (params) => {
    const url = `/v1/applications/${params.application_id}/versions/${params.version_number}/un-publish`;
    return Http.post(url, params.PublishApplicationVersionRequest);
};
