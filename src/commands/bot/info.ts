import { Args } from '@oclif/core'
import { ColumnUserConfig, Indexable, table, TableUserConfig } from 'table';

import { apiGetBot } from '../../api/modules/telegram/index.js';
import { BaseCommand } from '../../lib/base-command.js';
import { getTableConfig } from '../../utils/index.js';

export default class BotInfo extends BaseCommand {
    static override args = {
        appName: Args.string({ description: 'application name', required: true }),
    }
    static override summary = 'Manage bots in the mini-app';
    static topic = 'bot';

    public async run(): Promise<void> {
        const { args } = await this.parse(BotInfo);
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        if (platform_name === 'Telegram') {
            try {
                const res = await apiGetBot(application_id);
                this.showBotInfo(res);
            } catch {
                throw new Error("Telegram Application is not bound to a Telegram bot. Please use 'portex bot register <application_name> <bot_token>' to bind a Telegram bot before setting menu.");
            }
        } else {
            throw new Error('Only Telegram Platform Application is supported');
        }
    }

    private async showBotInfo(info: TelegramBotInfo): Promise<void> {
        const TABLE_COLUMNS: Indexable<ColumnUserConfig> = {
            0: { alignment: 'center', verticalAlignment: 'middle', width: 20 },
            1: { alignment: 'center', verticalAlignment: 'middle', width: 80 },
            2: { alignment: 'center', verticalAlignment: 'middle', width: 80 },
        };

        const TABLE_CONFIG: TableUserConfig = getTableConfig(TABLE_COLUMNS);

        const rows: string[][] = [['name', 'description', 'short_description'], [info.name, info.description, info.short_description]];

        const output = table(rows, TABLE_CONFIG);
        this.log(output);
    }
}
