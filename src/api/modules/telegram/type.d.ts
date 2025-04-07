declare interface BindBotRequest {
    /** telegram bot token */
    tg_bot_token: string;
}

declare interface BaseBotInfo {
    description: string,
    name: string,
    short_description: string
}

declare interface BotInfo extends BaseBotInfo {
    start_button_url: string
}


interface BotMessageButton {
    text: string, // 按钮文本
    url?: string, // 按钮链接，在 Public chat 中显示
    web_app?: {
        url: string // 按钮链接，在 Private chat 中显示
    }
}


/**
 * 键盘按钮,（待定）
 * @see https://core.telegram.org/bots/api#keyboardbutton
 */
interface BotMessageKeyboardButton {
    text: string, // 按钮文本
    web_app?: {
        url: string // 按钮链接，在 Private chat 中显示
    }
}
/**
 * 键盘
 * @see https://core.telegram.org/bots/api#replykeyboardmarkup
 */
interface BotMessageKeyboard {
    buttons: Array<Array<BotMessageKeyboardButton>>, // 按钮列表
    is_persistent: boolean, // 是否持久化
    resize: boolean, // 是否调整键盘大小
    one_time: boolean, // 是否一次性显示
    selective: boolean, // 是否选择性显示
    input_field_placeholder: string, // 输入框提示
}

interface BotMessage {
    text: string, // 消息内容
    buttons?: Array<Array<BotMessageButton>>, // 按钮列表，在 Private chat 中显示
    parse_mode?: "MarkdownV2" | "Markdown" | "HTML", // 消息内容解析方式，默认 text
    description?: string, // command 提示描述，在 command 列表中显示，仅仅在 Private chat
    keyboard?: BotMessageKeyboard, // 键盘列表，在 Public chat 中显示
}

declare interface BotMessages {
    [key: string]: BotMessage
}

declare interface BotMessagesResponse {
    commands: { [key: string]: BotMessage };
}
