/**
 * Create application request interface
 */
declare interface CreateApplicationRequest {
    /** Name of the application to be created */
    application_name: string
    /** Description of the application */
    description: string
    /** ID of the platform the application belongs to */
    platform_id: string
}

/**
 * Application query request interface
 */
declare interface ApplicationQueryRequest {
    /** Optional application ID to filter by */
    application_id?: string
    /** Optional application name to filter by */
    application_name?: string
    /** Optional platform ID to filter by */
    platform_id?: string
}

/**
 * Published version interface
 */
declare interface PublishedVersion {
    /** Version creation timestamp */
    created_at: number;
    /** Environment number where the version is deployed */
    env: number;
    /** Application version number */
    version: number;
}

/**
 * Application entity interface
 */
declare interface Application {
    /** Application creation timestamp */
    created_at: number
    /** Application description */
    description: string
    /** Application unique identifier */
    id: string
    /** Latest version number of the application */
    last_version: number
    /** Application name */
    name: string
    /** Name of the platform the application belongs to */
    platform_name: string
    /** Array of published versions, null if none exist */
    published_versions: Array<PublishedVersion> | null
}

/**
 * Application query response interface
 */
declare interface ApplicationQueryResponse {
    /** Array of applications matching the query */
    applications: Array<Application>
}

/**
 * Application deployment and upload parameters interface
 */
declare interface DeployUploadParams {
    /** Optional deployment description */
    description?: string,
    /** File buffer to be uploaded */
    file: Buffer<ArrayBufferLike>,
    /** MD5 hash of the file for verification */
    md5: string,
    /** Optional callback for upload progress */
    onUploadProgress?: (progressEvent: ProgressEvent) => void
    /** URL where the file should be uploaded */
    url: string,
}

/**
 * Deployment upload headers interface
 */
declare interface DeployUploadHeader {
    /** MD5 hash of the content */
    "Content-MD5": string,
    /** MIME type of the content */
    "Content-Type": string,
    /** Authorization token for the upload */
    "x-amz-meta-authorization": string,
    /** Optional description metadata */
    "x-amz-meta-description"?: string
}