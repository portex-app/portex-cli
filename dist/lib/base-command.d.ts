import { Command, type Config } from '@oclif/core';
import { Ora } from 'ora';
export declare abstract class BaseCommand extends Command {
    spinner: Ora;
    private platforms;
    constructor(argv: string[], config: Config);
    catch(error: Error): Promise<void>;
    /**
     * @description 选择平台
     * @returns Promise<string>
     */
    choisePlatform(): Promise<string>;
    getApplicationInfo(params?: ApplicationQueryRequest): Promise<Application>;
    getPlatformByName(platformName: string): Promise<string>;
    /**
     * fetch Platform info
     */
    private fetchPlatforms;
}
