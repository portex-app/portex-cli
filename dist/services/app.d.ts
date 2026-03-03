export declare function fetchPlatforms(): Promise<Array<{
    id: string;
    name: string;
}>>;
export declare function getPlatformByName(name: string): Promise<string>;
export declare function getApplicationInfo(params?: ApplicationQueryRequest): Promise<Application>;
export declare function listApplications(params?: ApplicationQueryRequest): Promise<Application[]>;
export declare function createApplication(params: {
    name: string;
    platformId: string;
    description?: string;
}): Promise<Application>;
