import { Flags } from '@oclif/core';
import readline from 'node:readline';
import { BaseCommand } from './base.js';
import { getApplicationInfo, listApplications } from '../services/app.js';
import { writeProjectConfig } from '../services/config.js';
import { t } from '../locales/index.js';
function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}
export default class Link extends BaseCommand {
    static description = 'Link current directory to an existing app';
    static flags = {
        app: Flags.string({ char: 'a', description: 'App name to link' }),
    };
    async run() {
        this.requireAuth();
        const { flags } = await this.parse(Link);
        let appName = flags.app;
        if (!appName) {
            const apps = await listApplications();
            if (!apps.length)
                this.error(t('error.appNotFound'));
            this.log('Your apps:');
            apps.forEach((a, i) => this.log(`  ${i + 1}. ${a.name}  (${a.platform_name})`));
            const idx = parseInt(await prompt('Select app (number): '), 10) - 1;
            if (idx < 0 || idx >= apps.length)
                this.error(t('error.appNotFound'));
            appName = apps[idx].name;
        }
        const app = await getApplicationInfo({ application_name: appName });
        writeProjectConfig({ appId: app.id, appName: app.name, deployPath: './dist' });
        this.log(`✓ Linked to "${app.name}"`);
    }
}
