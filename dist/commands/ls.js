import { Flags } from '@oclif/core';
import Table from 'cli-table3';
import { BaseCommand } from './base.js';
import { listApplications, getPlatformByName } from '../services/app.js';
import { t } from '../locales/index.js';
export default class Ls extends BaseCommand {
    static description = 'List your applications';
    static flags = {
        name: Flags.string({ char: 'n', description: 'Filter by name (fuzzy)' }),
        platform: Flags.string({ char: 'p', description: 'Filter by platform name' }),
        page: Flags.integer({ description: 'Page number (1-based)', default: 1 }),
        'per-page': Flags.integer({ description: 'Items per page', default: 20 }),
    };
    async run() {
        this.requireAuth();
        const { flags } = await this.parse(Ls);
        const params = {};
        if (flags.platform)
            params.platform_id = await getPlatformByName(flags.platform);
        let apps = await listApplications(params);
        if (!apps.length) {
            this.log(t('list.empty'));
            return;
        }
        if (flags.name) {
            const q = flags.name.toLowerCase();
            apps = apps.filter(a => a.name.toLowerCase().includes(q));
        }
        const perPage = flags['per-page'];
        const totalPages = Math.ceil(apps.length / perPage);
        const page = Math.min(Math.max(1, flags.page), totalPages);
        const pageApps = apps.slice((page - 1) * perPage, page * perPage);
        const tbl = new Table({
            head: [
                t('list.headers.name'),
                t('list.headers.platform'),
                t('list.headers.lastVersion'),
                'dev', 'test', 'prod',
                t('list.headers.description'),
            ],
            colWidths: [24, 12, 8, 6, 6, 6, 32],
            colAligns: ['left', 'left', 'right', 'right', 'right', 'right', 'left'],
            style: { head: ['cyan'] },
        });
        for (const app of pageApps) {
            const vmap = {};
            for (const v of app.published_versions ?? [])
                vmap[String(v.env)] = String(v.version);
            tbl.push([
                app.name,
                app.platform_name,
                String(app.last_version),
                vmap['0'] ?? '-',
                vmap['1'] ?? '-',
                vmap['2'] ?? '-',
                app.description ?? '-',
            ]);
        }
        this.log(tbl.toString());
        this.log(`  Page ${page}/${totalPages}  (${apps.length} total)`);
    }
}
