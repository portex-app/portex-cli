import { Args } from '@oclif/core';

import { apiDelBotMessages, apiGetBot } from '../../../api/modules/telegram/index.js';
import { BaseCommand } from '../../../lib/base-command.js';

export default class BotMessageDel extends BaseCommand {
    static override args = {
        appName: Args.string({ description: 'application name', required: true }),
        keys: Args.string({ description: 'message keys', required: false }),
    };
    static override description = 'delete message(s) of a Telegram bot';
    static override summary = 'About Telegram Bot Command';
    static topic = 'bot:message';

    public async run(): Promise<void> {
        const { args } = await this.parse(BotMessageDel);
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        const keys = this.argv.slice(1);

        if (keys.length === 0) {
            throw new Error('At least one message key must be provided.');
        }

        if (platform_name === 'Telegram') {
            try {
                await apiGetBot(application_id);
            } catch {
                throw new Error("Telegram Appliaction is not bound to a Telegram bot. Please use 'portex bot register <appliaction_name> <bot_token>' bind a Telegram bot before delete message.");
            }


            this.deleteBotMessage(application_id, keys);
        } else {
            throw new Error('Only Telegram Appliaction supports');
        }
    }

    private async deleteBotMessage(application_id: string, keys: string[]): Promise<void> {
        try {
            await apiDelBotMessages(application_id, keys);
            this.spinner.succeed('Bot message(s) deleted successfully');
        } catch {
            throw new Error('Failed to delete bot message(s)');

        }
    }
}
