import { BaseCommand } from '../lib/base-command.js';
export default class Login extends BaseCommand {
    /**
     * Command description for the command.
     * @type {string}
     */
    static description: string;
    static summary: string;
    /**
     * Main method that is executed when the command is run.
     * It handles user login by prompting for login credentials and processing them.
     * @async
     * @returns {Promise<void>}
     */
    run(): Promise<void>;
    /**
     * Prompts the user for login credentials and performs the login process.
     * Encrypts the user's password using AES-256-CBC, then sends the login request to the API.
     * @async
     * @returns {Promise<void>}
     */
    private login;
}
