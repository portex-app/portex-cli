import { apiBindBot, apiGetBot, apiGetBotMessages, apiSaveBotMessages, apiUpdateMenuButton, } from '../api/modules/telegram/index.js';
export async function getBotInfo(applicationId) {
    return apiGetBot(applicationId);
}
export async function registerBot(applicationId, botToken) {
    await apiBindBot(applicationId, botToken);
}
export async function getBotMessages(applicationId) {
    const res = await apiGetBotMessages(applicationId);
    return res.commands;
}
export async function saveBotMessages(applicationId, messages) {
    await apiSaveBotMessages(applicationId, messages);
}
export async function setMenuButton(applicationId, url, name) {
    await apiUpdateMenuButton(applicationId, url, name);
}
export function getDefaultMessageTemplate() {
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
    };
}
