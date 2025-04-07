import { BaseCommand } from '../../../lib/base-command.js';
export default class BotMessageLs extends BaseCommand {
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static summary: string;
    static topic: string;
    run(): Promise<void>;
    private getBotMessage;
    private showList;
}
