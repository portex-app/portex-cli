
import Http from "../../index.js";

/**
 * @description 获取版本列表
 * @param {string} applicationId - 应用ID
 * @returns 版本列表
 */
export const apiGetVersionList = async (applicationId: string): Promise<RepGetVersionList> => {
    const url = `/v1/applications/${applicationId}/versions`;
    return Http.get<RepGetVersionList>(url)
}
