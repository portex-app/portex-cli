import { Args } from '@oclif/core'

import { apiBindBot } from '../../api/modules/telegram/index.js';
import { BaseCommand } from '../../lib/base-command.js'

export default class BotRegister extends BaseCommand {

    static override args = {
        appName: Args.string({ description: 'deploy appliaction name', required: true }),
        botToken: Args.string({ description: 'telegram bot token', required: true })
    }
    static override description = 'register telegram bot'
    static override summary = 'About Telegram Bot Command';

    public async run(): Promise<void> {
        const { args } = await this.parse(BotRegister)
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        if (platform_name === 'Telegram') {
            try {
                this.applicationBindTelegramBot(application_id, args.botToken);
            } catch {
                throw new Error("Failed to get bot info");
            }
        } else {
            throw new Error('Only Telegram platform supports menu');
        }
    }

    /**
     * Register telegram bot
     * @param appliaction_id appliaction id
     * @param bot_token bot token
     */
    private async applicationBindTelegramBot(appliaction_id: string, bot_token: string): Promise<void> {
        try {
            await apiBindBot(appliaction_id, bot_token);
            this.spinner.succeed(`Register telegram bot success`);
        } catch {
            throw new Error("Failed to register telegram bot.");
        }
    }
}
