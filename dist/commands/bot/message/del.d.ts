import { BaseCommand } from '../../../lib/base-command.js';
export default class BotMessageDel extends BaseCommand {
    static topic: string;
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        keys: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static summary: string;
    run(): Promise<void>;
    private deleteBotMessage;
}
