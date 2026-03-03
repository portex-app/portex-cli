import { Flags } from '@oclif/core'
import { BaseCommand } from '../base.js'
import { getApplicationInfo } from '../../services/app.js'
import { getBotInfo } from '../../services/bot.js'
import { readProjectConfig } from '../../services/config.js'
import { t } from '../../locales/index.js'

export default class Bot extends BaseCommand {
    static description = 'Show bot info for the linked app'

    static flags = {
        app: Flags.string({ char: 'a', description: 'App name (defaults to .portex config)' }),
    }

    async run() {
        this.requireAuth()
        const { flags } = await this.parse(Bot)

        const appName = flags.app ?? readProjectConfig().appName
        if (!appName) this.error('App name required. Use --app or link a project with: portex link')

        const app = await getApplicationInfo({ application_name: appName })
        if (app.platform_name !== 'Telegram') this.error(t('bot.onlyTelegram'))

        try {
            const info = await getBotInfo(app.id)
            this.log(`${t('bot.info.name')}: ${info.name}`)
            this.log(`${t('bot.info.description')}: ${info.description}`)
            this.log(`${t('bot.info.shortDescription')}: ${info.short_description}`)
        } catch {
            this.error(t('bot.notBound'))
        }
    }
}
