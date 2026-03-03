export interface DeployOptions {
    appName: string;
    buildPath: string;
    description?: string;
    onProgress?: (stage: string, percent?: number) => void;
}
export interface DeployResult {
    version: number;
}
export declare function deployApp(opts: DeployOptions): Promise<DeployResult>;
