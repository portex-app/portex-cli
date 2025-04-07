import { BaseCommand } from '../../../lib/base-command.js';
export default class BotMessageSave extends BaseCommand {
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        messages: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static summary: string;
    static topic: string;
    run(): Promise<void>;
    /**
     * validate bot messages
     * @param jsonString bot messages json string
     * @returns validate result
     */
    /**
     * save bot messages
     * @param application_id application id
     * @param messages bot messages
     */
    private saveBotMessage;
}
