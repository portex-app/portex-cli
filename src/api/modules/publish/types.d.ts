/**
 * Publish application version request interface
 * Contains deployment environment information
 */
declare interface PublishApplicationVersionRequest {
    /**
     * Target environment for deployment
     * Can be 'dev', 'prod', 'test' or any custom environment string
     */
    env: 'dev' | 'prod' | 'test' | string
}

/**
 * Publish application request interface
 * Contains application ID, version information and deployment environment details
 */
declare interface PublishApplicationRequest {
    /**
     * Unique identifier of the application to be published
     */
    application_id: string;

    /**
     * Environment configuration for the deployment
     */
    PublishApplicationVersionRequest: PublishApplicationVersionRequest;

    /**
     * Version number of the application to be published
     */
    version_number: number;
}

/**
 * Unpublish application request interface
 * Contains application ID, version information and deployment environment details
 */
declare interface UnPublishApplicationRequest {
    /**
     * Unique identifier of the application to be unpublished
     */
    application_id: string;

    /**
     * Environment configuration for the deployment
     */
    PublishApplicationVersionRequest: PublishApplicationVersionRequest;

    /**
     * Version number of the application to be unpublished
     */
    version_number: number;
}