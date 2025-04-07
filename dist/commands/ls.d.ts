import { BaseCommand } from '../lib/base-command.js';
export default class Ls extends BaseCommand {
    /**
     * Command description for the command.
     * @type {string }
     */
    static description: string;
    /**
     * Command flags available for use.
     */
    static flags: {
        /**
         * Flag for specifying the application id.
         * @type {Flags.String}
         */
        appId: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        /**
         * Flag for specifying the application name.
         * @type {Flags.String}
         */
        appName: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        /**
         * Flag for help information.
         * @type {Flags.Help}
         */
        help: import("@oclif/core/interfaces").BooleanFlag<void>;
        /**
         * Flag for specifying the platform name
         */
        platform_name: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static summary: string;
    /**
     * Runs the command logic to fetch and display the application list.
     */
    run(): Promise<void>;
    /**
     * Fetches the list of applications from the API.
     * @async
     * @param  params - Optional query parameters to filter the applications.
     */
    private getApplicationList;
    /**
     * Displays the list of applications in a tabular format.
     * @async
     * @param applications - The list of applications to display.
     */
    private showApplicationList;
}
