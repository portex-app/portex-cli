/**
 * Type definitions for Telegram Bot API integration
 * 
 * This file contains interfaces and type definitions used for Telegram bot integration
 * with Portex applications. It defines the structure for bot information, messages,
 * and command configurations.
 */

/**
 * Telegram bot binding request interface
 * Used when binding a new bot to an application
 */
declare interface BindBotRequest {
    /** Telegram bot token obtained from BotFather */
    tg_bot_token: string;
}

/**
 * Base bot information interface with common fields
 * Contains the essential information required for all bot configurations
 */
declare interface BaseBotInfo {
    /** Detailed description of the bot's functionality and purpose */
    description: string,
    /** Display name of the bot as shown to users */
    name: string,
    /** Short description of the bot (max 120 characters) for quick reference */
    short_description: string
}

/**
 * Extended bot information interface with menu button URL
 * Includes all base bot information plus menu button configuration
 */
declare interface TelegramBotInfo extends BaseBotInfo {
    /** URL for the bot's menu button that opens in Telegram */
    menu_button_url: string
}

/**
 * Bot message button interface
 * Defines the structure for interactive buttons in bot messages
 */
interface BotMessageButton {
    /** Button text to display to users */
    text: string,
    /** Optional URL for the button in public chats */
    url?: string,
    /** Optional web app configuration for private chats */
    web_app?: {
        /** URL for the web app that opens in private chats */
        url: string
    }
}

/**
 * Bot message interface with various formatting options
 * Defines the structure for bot messages and command responses
 */
interface BotMessage {
    /** Optional array of buttons to display in private chats */
    buttons?: Array<BotMessageButton>,
    /** Optional command description shown in command list (private chats only) */
    description?: string,
    /** Optional message parsing mode for text formatting */
    parse_mode?: "HTML" | "MARKDOWN" | "MARKDOWNV2" | "TEXT",
    /** Main message text content */
    text: string,
}

/**
 * Type definition for a collection of bot messages indexed by command
 * Maps command names to their corresponding message configurations
 */
declare interface BotMessages {
    [key: string]: BotMessage
}

/**
 * Bot messages response interface with command definitions
 * Structure for retrieving all configured bot messages and commands
 */
declare interface BotMessagesResponse {
    /** Map of command names to their corresponding message configurations */
    commands: { [key: string]: BotMessage };
}
