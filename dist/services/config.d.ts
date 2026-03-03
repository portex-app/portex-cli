export interface ProjectConfig {
    appId?: string;
    appName?: string;
    platform?: string;
    deployPath?: string;
    description?: string;
}
export interface GlobalConfig {
    defaultLang?: 'zh' | 'en';
}
export declare function readProjectConfig(): ProjectConfig;
export declare function writeProjectConfig(config: ProjectConfig): void;
export declare function readGlobalConfig(): GlobalConfig;
export declare function writeGlobalConfig(config: GlobalConfig): void;
