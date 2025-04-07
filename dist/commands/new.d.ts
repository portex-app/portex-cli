import { BaseCommand } from '../lib/base-command.js';
export default class New extends BaseCommand {
    static summary: string;
    /**
     * Main method to run the command logic.
     * @async
     * @returns {Promise<void>}
     */
    run(): Promise<void>;
    /**
     * Creates the application with the specified platform ID, name, and description.
     * @async
     * @param {string} platform_id - The platform ID for the application.
     * @param {string} application_name - The name of the application.
     * @param {string} description - The description of the application.
     * @returns {Promise<void>}
     */
    private createAppliaction;
    /**
     * Prompts the user to enter the application name or returns the provided name from flags.
     * @async
     * @returns {Promise<string>} - The application name.
     */
    private getAppliactionName;
    /**
     * Prompts the user to optionally fill in the application description.
     * @async
     * @returns {Promise<string>} - The application description.
     */
    private getApplicationDescription;
    /**
     * Retrieves the platform ID either from flags or by prompting the user.
     * @async
     * @returns {Promise<string>} - The platform ID.
     */
    private getPlatformsId;
}
