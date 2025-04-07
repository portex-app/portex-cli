import { Command } from '@oclif/core';
import inquirer from 'inquirer';
import ora from 'ora';
import { apiGetApplicationList } from '../api/modules/applications/index.js';
import { apiGetPlatfroms } from '../api/modules/public/index.js';
export class BaseCommand extends Command {
    spinner;
    platforms = [];
    constructor(argv, config) {
        super(argv, config);
        this.spinner = ora();
    }
    async catch(error) {
        this.error(`${error.message}`, { exit: 1 });
    }
    /**
     * @description 选择平台
     * @returns Promise<string>
     */
    async choisePlatform() {
        if (this.platforms.length === 0) {
            try {
                await this.fetchPlatforms();
            }
            catch {
                throw new Error("Failed to fetch platform list.");
            }
        }
        const { platformId } = await inquirer.prompt([
            {
                choices: this.platforms,
                message: "Place select platform:",
                name: "platformId",
                type: "list",
            }
        ]);
        return platformId;
    }
    async getApplicationInfo(params) {
        try {
            const res = await apiGetApplicationList(params);
            if (res.applications && res.applications.length > 0) {
                return res.applications[0];
            }
            throw new Error(`this application is not exist,please use 'portex new' command create application first`);
        }
        catch {
            throw new Error("Failed to fetch application info.");
        }
    }
    async getPlatformByName(platformName) {
        if (this.platforms.length === 0) {
            try {
                await this.fetchPlatforms();
            }
            catch {
                this.exit(1);
            }
        }
        let platformId = null;
        for (const platformItem of this.platforms) {
            if (platformItem.name === platformName) {
                platformId = platformItem.value;
            }
        }
        if (platformId === null) {
            // 不支持这个平台
            throw new Error(`Platform "${platformName}" is not supported. Please check the platform name and try again.`);
        }
        else {
            // 返回平台id
            return platformId;
        }
    }
    /**
     * fetch Platform info
     */
    async fetchPlatforms() {
        if (this.platforms.length > 0)
            return;
        try {
            const res = await apiGetPlatfroms();
            if (res.platforms?.length > 0) {
                this.platforms = res.platforms.map(platform => ({
                    name: platform.name,
                    value: platform.id
                }));
            }
            else {
                throw new Error("No Platform Found");
            }
        }
        catch {
            throw new Error("Failed to fetch platform list.");
        }
    }
}
