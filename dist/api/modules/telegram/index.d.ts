/**
 * Telegram Bot API Module
 *
 * This module provides functionality for managing Telegram bot integration with Portex applications.
 * It includes methods for binding bots, managing bot information, menu buttons, and bot messages.
 */
/**
 * Bind a Telegram bot to an application
 * Associates a Telegram bot token with a Portex application
 * @param application_id - The ID of the application to bind the bot to
 * @param tg_bot_token - The Telegram bot token obtained from BotFather
 * @returns Promise<void>
 */
export declare const apiBindBot: (application_id: string, tg_bot_token: string) => Promise<void>;
/**
 * Retrieve bot information for an application
 * Gets the current configuration and status of the Telegram bot
 * @param application_id - The ID of the application
 * @returns Promise<TelegramBotInfo> - Bot information including name, description, and menu button URL
 */
export declare const apiGetBot: (application_id: string) => Promise<TelegramBotInfo>;
/**
 * Update bot information
 * Modifies the basic information of a Telegram bot
 * @param application_id - The ID of the application
 * @param params - New bot information including name and descriptions
 * @returns Promise<void>
 */
export declare const apiUpdateBot: (application_id: string, params: BaseBotInfo) => Promise<void>;
/**
 * Update the menu button configuration
 * Sets or modifies the menu button that appears in the Telegram chat
 * @param application_id - The ID of the application
 * @param button_url - The URL to open when the button is clicked
 * @param button_name - The display name of the button (defaults to 'open')
 * @returns Promise<void>
 */
export declare const apiUpdateMenuButton: (application_id: string, button_url: string, button_name?: string) => Promise<void>;
/**
 * Save bot messages and commands
 * Updates or creates new bot messages and command responses
 * @param application_id - The ID of the application
 * @param bot_messages - Collection of messages and commands to save
 * @returns Promise<void>
 */
export declare const apiSaveBotMessages: (application_id: string, bot_messages: BotMessages) => Promise<void>;
/**
 * Retrieve bot messages and commands
 * Gets all configured messages and commands for the bot
 * @param application_id - The ID of the application
 * @returns Promise<BotMessagesResponse> - Collection of bot messages and commands
 */
export declare const apiGetBotMessages: (application_id: string) => Promise<BotMessagesResponse>;
