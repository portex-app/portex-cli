import { Args } from '@oclif/core';
import { table } from 'table';
import { apiGetBot, apiGetBotMessages } from '../../../api/modules/telegram/index.js';
import { BaseCommand } from '../../../lib/base-command.js';
import { getTableConfig } from '../../../utils/index.js';
export default class BotMessageLs extends BaseCommand {
    static args = {
        appName: Args.string({ description: 'application name', required: true }),
    };
    static description = 'get bot message list';
    static summary = 'About Telegram Bot Command';
    static topic = 'bot:message';
    async run() {
        const { args } = await this.parse(BotMessageLs);
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        if (platform_name === 'Telegram') {
            try {
                await apiGetBot(application_id);
            }
            catch {
                throw new Error("Telegram Appliaction is not bound to a Telegram bot. Please use 'portex bot register <appliaction_name> <bot_token>' bind a Telegram bot before get bot message list.");
            }
            this.getBotMessage(application_id);
        }
        else {
            throw new Error('Only Telegram Appliaction supports');
        }
    }
    async getBotMessage(application_id) {
        try {
            const res = await apiGetBotMessages(application_id);
            if (Object.keys(res).length === 0) {
                throw new Error('No message found');
            }
            const list = Object.entries(res.commands).map(([commandKey, commandValue]) => [
                commandKey,
                commandValue.text
            ]);
            if (list.length > 0) {
                await this.showList(list);
            }
            else {
                console.log('No message found');
            }
        }
        catch {
            throw new Error('get bot message failed');
        }
    }
    async showList(list) {
        const TABLE_COLUMNS = {
            0: { alignment: 'center', verticalAlignment: 'middle', width: 20 },
            1: { alignment: 'center', verticalAlignment: 'middle', width: 80 },
        };
        const TABLE_CONFIG = getTableConfig(TABLE_COLUMNS);
        const rows = [['message_key', 'message_content'], ...list];
        const output = table(rows, TABLE_CONFIG);
        this.log(output);
    }
}
