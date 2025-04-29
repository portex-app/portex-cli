/**
 * Telegram Bot API Module
 *
 * This module provides functionality for managing Telegram bot integration with Portex applications.
 * It includes methods for binding bots, managing bot information, menu buttons, and bot messages.
 */
import Http from "../../index.js";
/**
 * Bind a Telegram bot to an application
 * Associates a Telegram bot token with a Portex application
 * @param application_id - The ID of the application to bind the bot to
 * @param tg_bot_token - The Telegram bot token obtained from BotFather
 * @returns Promise<void>
 */
export const apiBindBot = async (application_id, tg_bot_token) => {
    const url = `/v1/applications/${application_id}/tg-bots/sync`;
    return Http.post(url, { tg_bot_token });
};
/**
 * Retrieve bot information for an application
 * Gets the current configuration and status of the Telegram bot
 * @param application_id - The ID of the application
 * @returns Promise<TelegramBotInfo> - Bot information including name, description, and menu button URL
 */
export const apiGetBot = async (application_id) => {
    const url = `/v1/applications/${application_id}/tg-bots`;
    return Http.get(url);
};
/**
 * Update bot information
 * Modifies the basic information of a Telegram bot
 * @param application_id - The ID of the application
 * @param params - New bot information including name and descriptions
 * @returns Promise<void>
 */
export const apiUpdateBot = async (application_id, params) => {
    const url = `/v1/applications/${application_id}/tg/set-bot`;
    return Http.post(url, params);
};
/**
 * Update the menu button configuration
 * Sets or modifies the menu button that appears in the Telegram chat
 * @param application_id - The ID of the application
 * @param button_url - The URL to open when the button is clicked
 * @param button_name - The display name of the button (defaults to 'open')
 * @returns Promise<void>
 */
export const apiUpdateMenuButton = async (application_id, button_url, button_name = 'open') => {
    const url = `/v1/applications/${application_id}/tg-bots/menu-button`;
    return Http.put(url, { button_name, button_url });
};
/**
 * Save bot messages and commands
 * Updates or creates new bot messages and command responses
 * @param application_id - The ID of the application
 * @param bot_messages - Collection of messages and commands to save
 * @returns Promise<void>
 */
export const apiSaveBotMessages = async (application_id, bot_messages) => {
    const url = `/v1/applications/${application_id}/tg-bots/commands`;
    return Http.post(url, bot_messages);
};
/**
 * Retrieve bot messages and commands
 * Gets all configured messages and commands for the bot
 * @param application_id - The ID of the application
 * @returns Promise<BotMessagesResponse> - Collection of bot messages and commands
 */
export const apiGetBotMessages = async (application_id) => {
    const url = `/v1/applications/${application_id}/tg-bots/commands`;
    return Http.get(url);
};
