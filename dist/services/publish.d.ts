export declare function getVersionList(applicationId: string): Promise<Version[]>;
export declare function publishApp(params: {
    applicationId: string;
    appName: string;
    version: number;
    env: string;
}): Promise<string>;
