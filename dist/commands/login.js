import inquirer from 'inquirer';
import { createCipheriv } from 'node:crypto';
import fs from 'node:fs';
import { apiLogin } from '../api/modules/public/index.js';
import { BaseCommand } from '../lib/base-command.js';
export default class Login extends BaseCommand {
    /**
     * Command description for the command.
     * @type {string}
     */
    static description = 'login to your portex account';
    static summary = 'Login to Portex CLI';
    /**
     * Main method that is executed when the command is run.
     * It handles user login by prompting for login credentials and processing them.
     * @async
     * @returns {Promise<void>}
     */
    async run() {
        this.login(); // Call the login method to handle user authentication
    }
    /**
     * Prompts the user for login credentials and performs the login process.
     * Encrypts the user's password using AES-256-CBC, then sends the login request to the API.
     * @async
     * @returns {Promise<void>}
     */
    async login() {
        // Prompt for login credentials
        const { login, password } = await inquirer.prompt([
            {
                message: 'Please enter your account:',
                name: 'login',
                type: 'input',
            },
            {
                mask: '*',
                message: 'Please enter your password:',
                name: 'password',
                type: 'password',
            },
        ]);
        // AES encryption key and initialization vector
        const key = 'OsVgjzxz3GCbXnd/ANpKU6s501bGzrPZ';
        const cipher = createCipheriv('aes-256-cbc', key, key.slice(0, 16));
        const encrypted = cipher.update(password, 'utf8', 'base64') + cipher.final('base64');
        try {
            // Attempt to login with the encrypted password
            const { token } = await apiLogin({ login: login, password: encrypted });
            // Create the config directory and save the token in a file
            fs.mkdirSync(this.config.configDir, { recursive: true });
            fs.writeFileSync(process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_, token);
            // Notify the user of successful login
            this.spinner.succeed('Initialization completed. Congratulations! 🎉 🎉 🎉');
        }
        catch {
            throw new Error('Initialization failed, please try again');
        }
    }
}
