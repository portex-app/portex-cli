import { Args } from '@oclif/core';
import { apiGetBot, apiSaveBotMessages } from '../../../api/modules/telegram/index.js';
import { BaseCommand } from '../../../lib/base-command.js';
export default class BotMessageSave extends BaseCommand {
    static args = {
        appName: Args.string({ description: 'application name', required: true }),
        messages: Args.string({ description: 'bot message', required: true }),
    };
    static description = 'save bot messages';
    static summary = 'About Telegram Bot Command';
    static topic = 'bot:message';
    async run() {
        const { args } = await this.parse(BotMessageSave);
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        if (platform_name === 'Telegram') {
            try {
                await apiGetBot(application_id);
            }
            catch {
                throw new Error("Telegram Appliaction is not bound to a Telegram bot. Please use 'portex bot register <appliaction_name> <bot_token>' bind a Telegram bot before save bot messages.");
            }
            this.saveBotMessage(application_id, JSON.parse(args.messages));
            // if (this.isValidBotMessages(args.messages)) {
            //     this.saveBotMessage(application_id, JSON.parse(args.messages) as BotMessages);
            // } else {
            //     throw new Error('Invalid bot messages format');
            // }
        }
        else {
            throw new Error('Only Telegram Appliaction supports');
        }
    }
    /**
     * validate bot messages
     * @param jsonString bot messages json string
     * @returns validate result
     */
    // private isValidBotMessages(jsonString: string): boolean {
    //     try {
    //         const parsed = JSON.parse(jsonString);
    //         if (typeof parsed !== "object" || parsed === null) return false;
    //         // 内部方法：验证单个按钮
    //         const validateButton = (button: unknown): boolean => (
    //             typeof button === "object" &&
    //             button !== null &&
    //             "text" in button &&
    //             "url" in button &&
    //             typeof button.text === "string" &&
    //             typeof button.url === "string"
    //         );
    //         // 内部方法：验证按钮数组
    //         const validateButtons = (buttons: unknown): boolean => Array.isArray(buttons) && buttons.every((element) => validateButton(element));
    //         // 内部方法：验证单个消息
    //         const validateMessage = (message: unknown): boolean => {
    //             if (
    //                 typeof message !== "object" ||
    //                 message === null ||
    //                 !("text" in message) ||
    //                 typeof message.text !== "string" ||
    //                 !("type" in message) ||
    //                 typeof message.type !== "string" ||
    //                 !["HTML", "MARKDOWN", "MARKDOWNV2", "TEXT"].includes(message.type)
    //             ) {
    //                 return false;
    //             }
    //             if ("buttons" in message && message.buttons !== undefined) {
    //                 if (!Array.isArray(message.buttons)) {
    //                     return false;
    //                 }
    //                 if (!validateButtons(message.buttons)) {
    //                     return false;
    //                 }
    //             }
    //             return true;
    //         };
    //         return Object.values(parsed).every((element) => validateMessage(element));
    //     } catch {
    //         return false;
    //     }
    // }
    /**
     * save bot messages
     * @param application_id application id
     * @param messages bot messages
     */
    async saveBotMessage(application_id, messages) {
        // 实现保存逻辑
        try {
            await apiSaveBotMessages(application_id, messages);
            this.spinner.succeed('Save bot messages successfully');
        }
        catch {
            throw new Error('Save bot messages failed');
        }
    }
}
