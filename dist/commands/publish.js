import { Flags } from '@oclif/core';
import { BaseCommand } from './base.js';
import { getApplicationInfo } from '../services/app.js';
import { publishApp } from '../services/publish.js';
import { readProjectConfig } from '../services/config.js';
import { t } from '../locales/index.js';
export default class Publish extends BaseCommand {
    static description = 'Publish a deployed version to an environment';
    static flags = {
        app: Flags.string({ char: 'a', description: 'App name (defaults to .portex config)' }),
        version: Flags.integer({ char: 'v', description: 'Version number to publish', required: true }),
        env: Flags.string({ char: 'e', description: 'Target environment', options: ['dev', 'test', 'prod'], default: 'dev' }),
    };
    async run() {
        this.requireAuth();
        const { flags } = await this.parse(Publish);
        const appName = flags.app ?? readProjectConfig().appName;
        if (!appName)
            this.error('App name required. Use --app or link a project with: portex link');
        const app = await getApplicationInfo({ application_name: appName });
        this.log(t('publish.publishing'));
        try {
            const url = await publishApp({ applicationId: app.id, appName, version: flags.version, env: flags.env });
            this.log(`✓ ${t('publish.success')}`);
            this.log(`  ${t('publish.previewUrl')}: ${url}`);
        }
        catch {
            this.error(t('publish.failed'));
        }
    }
}
