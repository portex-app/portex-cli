declare interface PublishApplicationVersionRequest {
    env: 'dev' | 'prod' | 'test' | string
}

declare interface PublishApplicationRequest {
    application_id: string;
    PublishApplicationVersionRequest: PublishApplicationVersionRequest;
    version_number: number;
}


declare interface UnPublishApplicationRequest {
    application_id: string;
    PublishApplicationVersionRequest: PublishApplicationVersionRequest;
    version_number: number;
}