
/**
 * @description 创建应用-request
 */
declare interface CreateApplicationRequest {
    application_name: string
    description: string
    platform_id: string
}


/**
 * @description 应用列表查询-request
 */
declare interface ApplicationQueryRequest {
    application_id?: string
    application_name?: string
    platform_id?: string

}

/**
 * 
 */
declare interface PublishedVersion {
    created_at: number;
    env: number;
    version: number;
}


declare interface Application {
    created_at: number
    description: string
    id: string
    last_version: number
    name: string
    platform_name: string
    published_versions: Array<PublishedVersion> | null
}

declare interface ApplicationQueryResponse {
    applications: Array<Application>
}

declare interface DeployUploadParams {
    description?: string,
    file: Buffer<ArrayBufferLike>,
    md5: string,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
    url: string,

}
declare interface DeployUploadHeader {
    "Content-MD5": string,
    "Content-Type": string,
    "x-amz-meta-authorization": string,
    "x-amz-meta-description"?: string
}