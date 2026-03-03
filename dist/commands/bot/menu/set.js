import { Flags } from '@oclif/core';
import { BaseCommand } from '../../base.js';
import { getApplicationInfo } from '../../../services/app.js';
import { setMenuButton } from '../../../services/bot.js';
import { t } from '../../../locales/index.js';
export default class BotMenuSet extends BaseCommand {
    static description = 'Set the bot menu button';
    static flags = {
        app: Flags.string({ char: 'a', description: 'App name', required: true }),
        name: Flags.string({ char: 'n', description: 'Menu button label', required: true }),
        url: Flags.string({ char: 'u', description: 'Menu button URL', required: true }),
    };
    async run() {
        this.requireAuth();
        const { flags } = await this.parse(BotMenuSet);
        const app = await getApplicationInfo({ application_name: flags.app });
        if (app.platform_name !== 'Telegram')
            this.error(t('bot.onlyTelegram'));
        this.log(t('bot.menuButton.updating'));
        try {
            await setMenuButton(app.id, flags.url, flags.name);
            this.log(`✓ ${t('bot.menuButton.success')}`);
        }
        catch {
            this.error(t('bot.menuButton.failed'));
        }
    }
}
