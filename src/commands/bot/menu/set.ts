import { Args } from '@oclif/core'

import { apiGetBot, apiUpdateMenuButton } from '../../../api/modules/telegram/index.js';
import { BaseCommand } from '../../../lib/base-command.js'

export default class BotMenuSet extends BaseCommand {
    static override args = {
        appName: Args.string({ description: 'appliaction name', required: true }),
        menuName: Args.string({ default: 'open', description: 'menu name', required: true }),
        menuURL: Args.string({ description: 'menu url', required: true }),
    }
    static override description = 'set Telegram Menu button'
    static override summary = 'About Telegram Bot Command';
    static topic = 'bot:menu';

    public async run(): Promise<void> {
        const { args } = await this.parse(BotMenuSet);
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });

        if (platform_name !== 'Telegram') {
            throw new Error('Only Telegram Application is supported');
        }

        try {
            await apiGetBot(application_id);
        } catch {
            throw new Error(
                'Telegram Application is not bound to a Telegram bot. ' +
                'Please use "portex bot register <application_name> <bot_token>" ' +
                'to bind a Telegram bot before getting bot message list.'
            );
        }

        this.applicationSetMenu(application_id, args.menuURL, args.menuName);
    }

    private async applicationSetMenu(application_id: string, menuURL: string, menuName: string): Promise<void> {
        try {
            await apiUpdateMenuButton(application_id, menuURL, menuName);
            this.spinner.succeed('Menu button updated successfully');
        } catch {
            throw new Error('Failed to update menu button');
        }
    }
}
