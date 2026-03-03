import { Command } from '@oclif/core';
import { logout } from '../services/auth.js';
import { t } from '../locales/index.js';
export default class Logout extends Command {
    static description = 'Log out and clear credentials';
    async run() {
        logout();
        this.log(`✓ ${t('logout.success')}`);
    }
}
