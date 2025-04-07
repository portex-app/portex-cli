/**
 * @description 发布应用
 * @param params 发布应用参数
 */
export declare const apiPublishApplication: (params: PublishApplicationRequest) => Promise<void>;
/**
 * @description 下架应用
 * @param params 下架应用参数
 * @returns {Promise<void>}
 */
export declare const apiUnPublishApplication: (params: UnPublishApplicationRequest) => Promise<void>;
