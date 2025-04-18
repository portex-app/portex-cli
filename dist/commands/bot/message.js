import { Args, Flags } from '@oclif/core';
import fs from 'node:fs';
import path from 'node:path';
import { apiGetBot, apiGetBotMessages, apiSaveBotMessages } from '../../api/modules/telegram/index.js';
import { BaseCommand } from '../../lib/base-command.js';
export default class BotMessage extends BaseCommand {
    /**
     * Command arguments available for use.
     */
    static args = {
        appName: Args.string({ description: 'application name', required: true }),
        path: Args.string({ description: 'file path or directory path', required: false })
    };
    /**
     * Command description for the command.
     */
    static description = 'get or save bot messages';
    /**
     * Command flags available for use.
     */
    static flags = {
        input: Flags.boolean({ char: 'i', description: 'input messages from file', exclusive: ['output', 'template'], required: false }),
        output: Flags.boolean({ char: 'o', description: 'output messages to file', exclusive: ['input', 'template'], required: false }),
        template: Flags.boolean({ char: 't', description: 'output template instead of actual data', exclusive: ['input', 'output'], required: false })
    };
    /**
     * Command summary for the command.
     */
    static summary = 'Get or save bot messages';
    /**
     * Command topic for the command.
     */
    static topic = 'bot:message';
    /**
     * Main method that is executed when the command is run.
     * It handles the logic for getting or saving bot messages.
     * @async
     * @returns {Promise<void>}
     */
    async run() {
        const { args, flags } = await this.parse(BotMessage);
        this.spinner.start('Getting application information...');
        const { id: application_id, platform_name } = await this.getApplicationInfo({ application_name: args.appName });
        if (platform_name !== 'Telegram') {
            this.spinner.fail('Only Telegram application is supported');
            throw new Error('Only Telegram Application is supported');
        }
        try {
            this.spinner.text = 'Verifying bot binding status...';
            await apiGetBot(application_id);
        }
        catch {
            this.spinner.fail('Telegram application is not bound to a bot');
            throw new Error('Telegram Application is not bound to a Telegram bot. ' +
                'Please use "portex bot register <application_name> <bot_token>" ' +
                'to bind a Telegram bot before getting bot message list.');
        }
        const { input, output, template } = flags;
        const { path: filePath } = args;
        if (!input && !output && !template) {
            this.spinner.fail('Parameter error');
            throw new Error('Must specify one parameter: -i (input), -o (output) or -t (template)');
        }
        if (input) {
            this.spinner.text = 'Importing messages from file...';
            const input_file_path = this.getFilePath(filePath);
            const messages_json = JSON.parse(fs.readFileSync(input_file_path, 'utf8'));
            await this.saveBotMessages(application_id, { commands: messages_json });
        }
        if (output) {
            this.spinner.text = 'Exporting messages to file...';
            const save_file_path = this.getFilePath(filePath);
            await this.getBotMessages(application_id, save_file_path, false);
        }
        if (template) {
            this.spinner.text = 'Exporting template to file...';
            const save_file_path = this.getFilePath(filePath);
            await this.getBotMessages(application_id, save_file_path, true);
        }
    }
    /**
     * Get bot messages and save to file
     * @param application_id application id
     * @param save_file_path file path to save messages
     * @param isTemp whether to save template or actual data
     */
    async getBotMessages(application_id, save_file_path, isTemp = false) {
        try {
            let commands;
            if (isTemp) {
                commands = this.getDefaultMessageTemp();
            }
            else {
                const response = await apiGetBotMessages(application_id);
                commands = response.commands;
            }
            this.log('More info see: https://portex-app.gitbook.io/portex-docs/cli/bot-manager');
            fs.writeFileSync(save_file_path, JSON.stringify(commands, null, 2));
            this.spinner.succeed('Get bot messages successfully');
        }
        catch (error) {
            this.spinner.fail('Get bot messages failed: ' + error);
        }
    }
    /**
     * Get default message template
     * @returns Default message template
     */
    getDefaultMessageTemp() {
        return {
            "buttons_message": {
                "buttons": [
                    {
                        "text": "button 1",
                        "url": "https://google.com"
                    },
                    {
                        "text": "button 2",
                        "web_app": {
                            "url": "https://google.com"
                        }
                    }
                ],
                "description": "description",
                "parse_mode": "TEXT",
                "text": "test contents"
            },
            "markdown_message": {
                "buttons": [
                    {
                        "text": "button 1",
                        "url": "https://t.me/portex_app_bot"
                    },
                    {
                        "text": "button 2",
                        "web_app": {
                            "url": "https://google.com"
                        }
                    }
                ],
                "description": "description",
                "parse_mode": "MARKDOWNV2",
                "text": "这是一条自定义样式的消息[图片](https://via.placeholder.com/300x100)"
            },
            "text_message": {
                "description": "description",
                "parse_mode": "TEXT",
                "text": "test contents"
            }
        };
    }
    /**
     * Get file path for messages
     * @param filePath file path or directory path
     * @returns resolved file path
     */
    getFilePath(filePath) {
        try {
            if (filePath) {
                // Check if path ends with .json
                const isJsonFile = path.extname(filePath).toLowerCase() === '.json';
                if (isJsonFile) {
                    // If it's a json file, use it directly
                    return path.resolve(process.cwd(), filePath);
                }
                // If it's not a json file, treat it as a directory path
                return path.resolve(process.cwd(), filePath, 'messages.json');
            }
            // If no path provided, use messages.json in current directory
            return path.resolve(process.cwd(), 'messages.json');
        }
        catch (error) {
            this.spinner.fail('Invalid file path: ' + error);
            throw error;
        }
    }
    /**
     * Save bot messages
     * @param application_id application id
     * @param messages bot messages
     */
    async saveBotMessages(application_id, messages) {
        try {
            await apiSaveBotMessages(application_id, messages);
            this.spinner.succeed('Save bot messages successfully');
        }
        catch (error) {
            this.spinner.fail('Save bot messages failed: ' + error);
        }
    }
}
