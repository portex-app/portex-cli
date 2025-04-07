import { Args, Flags } from '@oclif/core';
import inquirer from 'inquirer';
import { apiPublishApplication } from "../api/modules/publish/index.js";
import { apiGetVersionList } from '../api/modules/versions/index.js';
import { BaseCommand } from '../lib/base-command.js';
export default class Publish extends BaseCommand {
    /**
     * Command arguments available for use.
     */
    static args = {
        appName: Args.string({ description: 'publish application name', required: true }),
        version: Args.string({ description: 'publish application version', required: true }),
    };
    /**
     * Command description for the command.
     * @type {string}
     */
    static description = 'publish mini-app to portex';
    /**
     * Command flags available for use.
     */
    static flags = {
        env: Flags.string({ char: 'e', default: 'dev', description: 'publish environment', options: ['dev', 'test', 'prod'] }),
    };
    static summary = 'Publish mini-app';
    async run() {
        const { args, flags } = await this.parse(Publish);
        const { id: application_id } = await this.getApplicationInfo({ application_name: args.appName });
        const { version } = await this.getApplicationVersion(application_id, args.version);
        const { env: environment } = flags;
        if (version > 0 && application_id && environment) {
            const { environmentConfirm } = await inquirer.prompt([
                {
                    message: `Are you sure you want to publish ${args.appName} version ${version} to ${environment}?`,
                    name: "environmentConfirm",
                    type: "confirm",
                },
            ]);
            if (environmentConfirm) {
                const request_data = {
                    application_id,
                    "PublishApplicationVersionRequest": {
                        "env": environment,
                    },
                    "version_number": version,
                };
                this.publishApplication(request_data);
            }
        }
    }
    async getApplicationVersion(application_id, version) {
        try {
            const { versions } = await apiGetVersionList(application_id);
            if (!versions || versions.length === 0) {
                throw new Error("this version is not exist");
            }
            const targetVersion = version.toString();
            const versionInfo = versions.find(item => item.version.toString() === targetVersion);
            if (!versionInfo) {
                throw new Error("this version is not exist");
            }
            return versionInfo;
        }
        catch (error) {
            console.error("Error fetching application version:", error);
            throw new Error("Failed to fetch application info.");
        }
    }
    async publishApplication(params) {
        try {
            const { args: { appName } } = await this.parse(Publish);
            const { env } = params.PublishApplicationVersionRequest;
            await apiPublishApplication(params);
            this.spinner.succeed('publish application success!');
            const previewUrl = env === 'prod'
                ? `https://${appName}.portex.app/`
                : `https://${appName}.${env}.portex.app/`;
            this.spinner.succeed(`Preivew URL: ${previewUrl}`);
        }
        catch {
            throw new Error('publish application error');
        }
    }
}
