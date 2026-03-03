import { Flags } from '@oclif/core'
import { BaseCommand } from './base.js'
import { deployApp } from '../services/deploy.js'
import { t } from '../locales/index.js'

export default class Deploy extends BaseCommand {
    static description = 'Deploy app build to Portex'

    static flags = {
        app:         Flags.string({ char: 'a', description: 'App name', required: true }),
        path:        Flags.string({ char: 'p', description: 'Build directory path', required: true }),
        description: Flags.string({ char: 'd', description: 'Version description' }),
    }

    async run() {
        this.requireAuth()
        const { flags } = await this.parse(Deploy)

        let stage = ''
        try {
            const result = await deployApp({
                appName: flags.app,
                buildPath: flags.path,
                description: flags.description,
                onProgress: (s, pct) => {
                    const labels: Record<string, string> = {
                        compressing: t('deploy.compressing'),
                        getting_url: t('deploy.gettingUrl'),
                        uploading:   t('deploy.uploading'),
                    }
                    if (s !== stage) {
                        stage = s
                        process.stdout.write(`\r${labels[s] ?? s}${pct !== undefined ? ` ${pct}%` : ''}`)
                    } else if (pct !== undefined) {
                        process.stdout.write(`\r${labels[s] ?? s} ${pct}%   `)
                    }
                },
            })
            process.stdout.write('\n')
            this.log(`✓ ${t('deploy.success')}  ${t('deploy.version')}: v${result.version}`)
            this.log(`  ${t('deploy.nextStep')}`)
        } catch (e) {
            process.stdout.write('\n')
            this.error(`${t('deploy.failed')}: ${e instanceof Error ? e.message : e}`)
        }
    }
}
