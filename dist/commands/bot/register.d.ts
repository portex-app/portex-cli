import { BaseCommand } from '../../lib/base-command.js';
export default class BotRegister extends BaseCommand {
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        botToken: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static summary: string;
    run(): Promise<void>;
    /**
     * Register telegram bot
     * @param appliaction_id appliaction id
     * @param bot_token bot token
     */
    private applicationBindTelegramBot;
}
