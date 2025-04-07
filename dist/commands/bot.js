import { Args } from '@oclif/core';
import { table } from 'table';
import { apiGetBot } from '../api/modules/telegram/index.js';
import { BaseCommand } from '../lib/base-command.js';
import { getTableConfig } from '../utils/index.js';
export default class Bot extends BaseCommand {
    static args = {
        appName: Args.string({ description: 'application name', required: true }),
    };
    static summary = 'Manage bots in the mini-app';
    static topic = 'bot';
    async run() {
        const { args } = await this.parse(Bot);
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        if (platform_name === 'Telegram') {
            try {
                const res = await apiGetBot(application_id);
                this.showBotInfo(res);
            }
            catch {
                this.spinner.fail(`Telegram Appliaction is not bound to a Telegram bot. Please use 'portex bot register ${args.appName} <bot_token>' bind a Telegram bot before set menu."`);
            }
        }
        else {
            this.spinner.fail('Only Telegram Platform Appliaction supports');
        }
    }
    async showBotInfo(info) {
        const TABLE_COLUMNS = {
            0: { alignment: 'center', verticalAlignment: 'middle', width: 20 },
            1: { alignment: 'center', verticalAlignment: 'middle', width: 80 },
            2: { alignment: 'center', verticalAlignment: 'middle', width: 80 },
        };
        const TABLE_CONFIG = getTableConfig(TABLE_COLUMNS);
        const rows = [['name', 'description', 'short_description'], [info.name, info.description, info.short_description]];
        const output = table(rows, TABLE_CONFIG);
        this.log(output);
    }
}
