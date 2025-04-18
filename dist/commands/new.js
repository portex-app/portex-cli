import inquirer from 'inquirer';
import { apiCreateApplication } from '../api/modules/applications/index.js';
import { BaseCommand } from '../lib/base-command.js';
export default class New extends BaseCommand {
    static summary = "Create a new mini-app";
    /**
     * Main method to run the command logic.
     * @async
     * @returns {Promise<void>}
     */
    async run() {
        const name = await this.getAppliactionName(); // Get the application name
        const platformId = await this.getPlatformsId(); // Get the platform ID
        const description = await this.getApplicationDescription(); // Get the application description
        this.createAppliaction(platformId, name, description); // Create the application using the provided details
    }
    /**
     * Creates the application with the specified platform ID, name, and description.
     * @async
     * @param {string} platform_id - The platform ID for the application.
     * @param {string} application_name - The name of the application.
     * @param {string} description - The description of the application.
     * @returns {Promise<void>}
     */
    async createAppliaction(platform_id, application_name, description) {
        try {
            // Call the API to create the application
            await apiCreateApplication({
                application_name,
                description,
                platform_id,
            });
            // Show success message if creation is successful
            this.spinner.succeed("Create application success! :tada: :tada: :tada:");
        }
        catch {
            // Show failure message if the creation fails
            this.spinner.fail("Create application failed, please try again");
            // throw new Error('Create application failed, please try again');
        }
    }
    /**
     * Prompts the user to enter the application name or returns the provided name from flags.
     * @async
     * @returns {Promise<string>} - The application name.
     */
    async getAppliactionName() {
        const { flags } = await this.parse(New); // Parse the flags provided by the user
        if (flags.name) {
            return flags.name; // If the name is provided through flags, return it
        }
        // If no name is provided, prompt the user to enter a name
        const { name } = await inquirer.prompt([
            {
                message: 'Please enter the application name:', // Prompt message
                name: 'name',
                required: true, // This field is required
                type: 'input',
                async validate(input) {
                    // Validation for the application name
                    // Validation for the application name 小写 数字 下划线 最长35个字符 组成
                    const regex = /^[a-z0-9_]{5,35}$/; // Name must start with a letter and can include letters, numbers, or underscores
                    if (!regex.test(input)) {
                        return 'Invalid name: must start with a letter, contain only letters, numbers, or underscores, and be 5-35 characters long';
                    }
                    return true;
                }
            }
        ]);
        return name; // Return the entered application name
    }
    /**
     * Prompts the user to optionally fill in the application description.
     * @async
     * @returns {Promise<string>} - The application description.
     */
    async getApplicationDescription() {
        const { shouldEnterText } = await inquirer.prompt([
            {
                choices: ['yes', 'no'],
                message: 'Fill in the application description (optional):', // Prompt for description
                name: 'shouldEnterText',
                type: 'list', // List choices for the user to pick
            },
        ]);
        let description = ''; // Default empty description
        if (shouldEnterText === 'yes') {
            // If the user chooses to enter a description, prompt for it
            const { inputDescription } = await inquirer.prompt([
                {
                    message: 'Please enter the application description (up to 140 characters):', // Prompt for description
                    name: 'inputDescription',
                    type: 'input',
                    validate(input) {
                        if (input.length > 140) {
                            return 'The description cannot exceed 140 characters.'; // Validation for description length
                        }
                        return true;
                    },
                },
            ]);
            description = inputDescription; // Set the description
        }
        return description; // Return the description
    }
    /**
     * Retrieves the platform ID either from flags or by prompting the user.
     * @async
     * @returns {Promise<string>} - The platform ID.
     */
    async getPlatformsId() {
        const { flags } = await this.parse(New); // Parse the flags provided by the user
        if (flags.platform) {
            // If platform is provided through flags, return the platform ID
            const id = this.getPlatformByName(flags.platform);
            return id;
        }
        // If no platform is provided, prompt the user to choose a platform
        return this.choisePlatform();
    }
}
