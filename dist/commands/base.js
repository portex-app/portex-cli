import { Command } from '@oclif/core';
import { isLoggedIn } from '../services/auth.js';
export class BaseCommand extends Command {
    requireAuth() {
        if (!isLoggedIn())
            this.error('Not logged in. Run: portex login');
    }
}
