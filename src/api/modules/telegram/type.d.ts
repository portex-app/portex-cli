/**
 * Telegram bot binding request interface
 */
declare interface BindBotRequest {
    /** Telegram bot token obtained from BotFather */
    tg_bot_token: string;
}

/**
 * Base bot information interface with common fields
 */
declare interface BaseBotInfo {
    /** Detailed description of the bot */
    description: string,
    /** Display name of the bot */
    name: string,
    /** Short description of the bot (max 120 characters) */
    short_description: string
}

/**
 * Extended bot information interface with menu button URL
 */
declare interface TelegramBotInfo extends BaseBotInfo {
    /** URL for the bot's menu button */
    menu_button_url: string
}

/**
 * Bot message button interface
 */
interface BotMessageButton {
    /** Button text to display */
    text: string,
    /** Optional URL for the button in public chats */
    url?: string,
    /** Optional web app configuration for private chats */
    web_app?: {
        /** URL for the web app in private chats */
        url: string
    }
}

/**
 * Bot message interface with various formatting options
 */
interface BotMessage {
    /** Optional buttons to display in private chats */
    buttons?: Array<BotMessageButton>,
    /** Optional command description shown in command list (private chats only) */
    description?: string,
    /** Optional message parsing mode */
    parse_mode?: "HTML" | "MARKDOWN" | "MARKDOWNV2" | "TEXT",
    /** Main message text content */
    text: string,
}

/**
 * Type definition for a collection of bot messages indexed by command
 */
declare interface BotMessages {
    [key: string]: BotMessage
}

/**
 * Bot messages response interface with command definitions
 */
declare interface BotMessagesResponse {
    /** Map of command names to their corresponding message configurations */
    commands: { [key: string]: BotMessage };
}
