import { Args } from '@oclif/core';
import { apiGetBot, apiUpdateMenuButton } from '../../../api/modules/telegram/index.js';
import { BaseCommand } from '../../../lib/base-command.js';
export default class BotMenuSet extends BaseCommand {
    static args = {
        appName: Args.string({ description: 'appliaction name', required: true }),
        menuURL: Args.string({ description: 'menu url', required: true }),
    };
    static description = 'set Telegram Menu button';
    static summary = 'About Telegram Bot Command';
    static topic = 'bot:menu';
    async run() {
        const { args } = await this.parse(BotMenuSet);
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        if (platform_name === 'Telegram') {
            try {
                await apiGetBot(application_id);
            }
            catch {
                throw new Error("Telegram Appliaction is not bound to a Telegram bot. Please use 'portex bot register <appliaction_name> <bot_token>' bind a Telegram bot before set menu.");
            }
            this.applicationSetMenu(application_id, args.menuURL);
        }
        else {
            throw new Error('Only Telegram Appliaction supports');
        }
    }
    async applicationSetMenu(application_id, menuURL) {
        try {
            await apiUpdateMenuButton(application_id, menuURL);
            this.spinner.succeed('Menu button updated successfully');
        }
        catch {
            throw new Error('Failed to update menu button');
        }
    }
}
