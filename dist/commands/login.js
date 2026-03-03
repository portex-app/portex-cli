import { Command } from '@oclif/core';
import readline from 'node:readline';
import { login } from '../services/auth.js';
import { t } from '../locales/index.js';
function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}
function promptPassword(question) {
    return new Promise(resolve => {
        process.stdout.write(question);
        const rl = readline.createInterface({ input: process.stdin, output: undefined });
        process.stdin.setRawMode?.(true);
        let password = '';
        process.stdin.on('data', function handler(ch) {
            const char = ch.toString();
            if (char === '\n' || char === '\r' || char === '\u0003') {
                process.stdin.setRawMode?.(false);
                process.stdin.removeListener('data', handler);
                rl.close();
                process.stdout.write('\n');
                resolve(password);
            }
            else if (char === '\u007f') {
                password = password.slice(0, -1);
            }
            else {
                password += char;
                process.stdout.write('*');
            }
        });
    });
}
export default class Login extends Command {
    static description = 'Log in to Portex';
    async run() {
        const account = await prompt(`${t('login.account')}: `);
        const password = await promptPassword(`${t('login.password')}: `);
        this.log(t('login.loggingIn'));
        try {
            await login(account, password);
            this.log(`✓ ${t('login.success')}`);
        }
        catch {
            this.error(t('login.failed'));
        }
    }
}
