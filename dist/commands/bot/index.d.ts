import { BaseCommand } from '../base.js';
export default class Bot extends BaseCommand {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
