import { Flags } from '@oclif/core';
import readline from 'node:readline';
import { BaseCommand } from './base.js';
import { createApplication, fetchPlatforms, getPlatformByName } from '../services/app.js';
import { writeProjectConfig } from '../services/config.js';
import { t } from '../locales/index.js';
function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}
export default class New extends BaseCommand {
    static description = 'Create a new application';
    static flags = {
        name: Flags.string({ char: 'n', description: 'App name (5-35 chars, a-z0-9_)' }),
        platform: Flags.string({ char: 'p', description: 'Platform name (e.g. Telegram)' }),
        description: Flags.string({ char: 'd', description: 'App description' }),
    };
    async run() {
        this.requireAuth();
        const { flags } = await this.parse(New);
        const nameRegex = /^[a-z0-9_]{5,35}$/;
        let name = flags.name ?? await prompt(`${t('new.appName')}: `);
        while (!nameRegex.test(name)) {
            this.warn(t('new.appNameInvalid'));
            name = await prompt(`${t('new.appName')}: `);
        }
        let platformId;
        if (flags.platform) {
            platformId = await getPlatformByName(flags.platform);
        }
        else {
            const platforms = await fetchPlatforms();
            this.log('Available platforms:');
            platforms.forEach((p, i) => this.log(`  ${i + 1}. ${p.name}`));
            const idx = parseInt(await prompt('Select platform (number): '), 10) - 1;
            if (idx < 0 || idx >= platforms.length)
                this.error(t('error.platformNotFound'));
            platformId = platforms[idx].id;
        }
        const description = flags.description ?? await prompt(`${t('new.description')} (optional): `);
        this.log(t('new.creating'));
        try {
            const app = await createApplication({ name, platformId, description });
            writeProjectConfig({ appId: app.id, appName: name, deployPath: './dist', description });
            this.log(`✓ ${t('new.success')}`);
            this.log(`✓ .portex/config.json created`);
        }
        catch {
            this.error(t('new.failed'));
        }
    }
}
