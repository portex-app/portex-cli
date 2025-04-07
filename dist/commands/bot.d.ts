import { BaseCommand } from '../lib/base-command.js';
export default class Bot extends BaseCommand {
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static summary: string;
    static topic: string;
    run(): Promise<void>;
    private showBotInfo;
}
