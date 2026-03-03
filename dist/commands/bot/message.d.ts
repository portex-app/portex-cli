import { BaseCommand } from '../base.js';
export default class BotMessage extends BaseCommand {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        file: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        input: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        output: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        template: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
