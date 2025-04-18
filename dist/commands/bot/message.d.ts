import { BaseCommand } from '../../lib/base-command.js';
export default class BotMessage extends BaseCommand {
    /**
     * Command arguments available for use.
     */
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        path: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    /**
     * Command description for the command.
     */
    static description: string;
    /**
     * Command flags available for use.
     */
    static flags: {
        input: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        output: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        template: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    /**
     * Command summary for the command.
     */
    static summary: string;
    /**
     * Command topic for the command.
     */
    static topic: string;
    /**
     * Main method that is executed when the command is run.
     * It handles the logic for getting or saving bot messages.
     * @async
     * @returns {Promise<void>}
     */
    run(): Promise<void>;
    /**
     * Get bot messages and save to file
     * @param application_id application id
     * @param save_file_path file path to save messages
     * @param isTemp whether to save template or actual data
     */
    private getBotMessages;
    /**
     * Get default message template
     * @returns Default message template
     */
    private getDefaultMessageTemp;
    /**
     * Get file path for messages
     * @param filePath file path or directory path
     * @returns resolved file path
     */
    private getFilePath;
    /**
     * Save bot messages
     * @param application_id application id
     * @param messages bot messages
     */
    private saveBotMessages;
}
