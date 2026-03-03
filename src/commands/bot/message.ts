import { Flags } from '@oclif/core'
import fs from 'node:fs'
import path from 'node:path'
import { BaseCommand } from '../base.js'
import { getApplicationInfo } from '../../services/app.js'
import { getBotMessages, saveBotMessages, getDefaultMessageTemplate } from '../../services/bot.js'
import { t } from '../../locales/index.js'

export default class BotMessage extends BaseCommand {
    static description = 'Manage bot messages (import / export / template)'

    static flags = {
        app:      Flags.string({ char: 'a', description: 'App name', required: true }),
        file:     Flags.string({ char: 'f', description: 'JSON file path', default: 'messages.json' }),
        input:    Flags.boolean({ char: 'i', description: 'Import messages from file', exclusive: ['output', 'template'] }),
        output:   Flags.boolean({ char: 'o', description: 'Export messages to file', exclusive: ['input', 'template'] }),
        template: Flags.boolean({ char: 't', description: 'Export default template', exclusive: ['input', 'output'] }),
    }

    async run() {
        this.requireAuth()
        const { flags } = await this.parse(BotMessage)

        const app = await getApplicationInfo({ application_name: flags.app })
        if (app.platform_name !== 'Telegram') this.error(t('bot.onlyTelegram'))

        const filePath = path.resolve(process.cwd(), flags.file)

        if (flags.input) {
            const messages = JSON.parse(fs.readFileSync(filePath, 'utf8'))
            await saveBotMessages(app.id, messages)
            this.log('✓ Bot messages saved')
        } else if (flags.output) {
            const messages = await getBotMessages(app.id)
            fs.writeFileSync(filePath, JSON.stringify(messages, null, 2))
            this.log(`✓ Messages exported to ${filePath}`)
        } else if (flags.template) {
            fs.writeFileSync(filePath, JSON.stringify(getDefaultMessageTemplate(), null, 2))
            this.log(`✓ Template exported to ${filePath}`)
        } else {
            this.error('Specify --input (-i), --output (-o), or --template (-t)')
        }
    }
}
