import { Command } from '@oclif/core'
import { isLoggedIn } from '../services/auth.js'

export abstract class BaseCommand extends Command {
    protected requireAuth(): void {
        if (!isLoggedIn()) this.error('Not logged in. Run: portex login')
    }
}
