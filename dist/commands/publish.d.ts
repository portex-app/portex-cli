import { BaseCommand } from '../lib/base-command.js';
export default class Publish extends BaseCommand {
    /**
     * Command arguments available for use.
     */
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        version: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    /**
     * Command description for the command.
     * @type {string}
     */
    static description: string;
    /**
     * Command flags available for use.
     */
    static flags: {
        env: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static summary: string;
    run(): Promise<void>;
    private getApplicationVersion;
    private publishApplication;
}
