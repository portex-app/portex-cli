import { BaseCommand } from '../../../lib/base-command.js';
export default class BotMenuSet extends BaseCommand {
    static args: {
        appName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        menuName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        menuURL: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static summary: string;
    static topic: string;
    run(): Promise<void>;
    private applicationSetMenu;
}
