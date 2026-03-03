import {
    apiBindBot,
    apiGetBot,
    apiGetBotMessages,
    apiSaveBotMessages,
    apiUpdateMenuButton,
} from '../api/modules/telegram/index.js'

export async function getBotInfo(applicationId: string): Promise<TelegramBotInfo> {
    return apiGetBot(applicationId)
}

export async function registerBot(applicationId: string, botToken: string): Promise<void> {
    await apiBindBot(applicationId, botToken)
}

export async function getBotMessages(applicationId: string): Promise<BotMessages> {
    const res = await apiGetBotMessages(applicationId)
    return res.commands
}

export async function saveBotMessages(applicationId: string, messages: BotMessages): Promise<void> {
    await apiSaveBotMessages(applicationId, messages)
}

export async function setMenuButton(
    applicationId: string,
    url: string,
    name: string
): Promise<void> {
    await apiUpdateMenuButton(applicationId, url, name)
}

export function getDefaultMessageTemplate(): BotMessages {
    return {
        text_message: {
            description: 'description',
            parse_mode: 'TEXT',
            text: 'Hello from Portex!',
        },
        buttons_message: {
            description: 'description',
            parse_mode: 'TEXT',
            text: 'Choose an option:',
            buttons: [
                { text: 'Open App', web_app: { url: 'https://example.com' } },
                { text: 'Visit Site', url: 'https://portex.app' },
            ],
        },
        markdown_message: {
            description: 'description',
            parse_mode: 'MARKDOWNV2',
            text: 'Welcome to *Portex*!',
            buttons: [
                { text: 'Open', web_app: { url: 'https://example.com' } },
            ],
        },
    }
}
