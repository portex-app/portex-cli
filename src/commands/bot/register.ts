import { Flags } from '@oclif/core'
import { BaseCommand } from '../base.js'
import { getApplicationInfo } from '../../services/app.js'
import { registerBot } from '../../services/bot.js'
import { t } from '../../locales/index.js'

export default class BotRegister extends BaseCommand {
    static description = 'Register a Telegram bot token for the app'

    static flags = {
        app:   Flags.string({ char: 'a', description: 'App name', required: true }),
        token: Flags.string({ char: 't', description: 'Telegram bot token', required: true }),
    }

    async run() {
        this.requireAuth()
        const { flags } = await this.parse(BotRegister)

        const app = await getApplicationInfo({ application_name: flags.app })
        if (app.platform_name !== 'Telegram') this.error(t('bot.onlyTelegram'))

        this.log(t('bot.register.registering'))
        try {
            await registerBot(app.id, flags.token)
            this.log(`✓ ${t('bot.register.success')}`)
        } catch {
            this.error(t('bot.register.failed'))
        }
    }
}
