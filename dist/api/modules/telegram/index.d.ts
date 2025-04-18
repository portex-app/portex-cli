/**
 * tg应用判定机器人token
 * @param application_id 要绑定机器人的应用id
 * @param tg_bot_token 机器人的token
 */
export declare const apiBindBot: (application_id: string, tg_bot_token: string) => Promise<void>;
/**
 * 获取机器人信息
 * @param application_id 应用id
 * @returns
 */
export declare const apiGetBot: (application_id: string) => Promise<TelegramBotInfo>;
/**
 * 修改机器人信息
 * @param application_id 应用id
 * @param params 修改机器人基本信息
 */
export declare const apiUpdateBot: (application_id: string, params: BaseBotInfo) => Promise<void>;
/**
 * 修改菜单按钮
 * @param application_id 应用id
 * @param button_url 按钮链接
 * @param button_name 按钮名称
 */
export declare const apiUpdateMenuButton: (application_id: string, button_url: string, button_name?: string) => Promise<void>;
/**
 * 新增机器人消息
 * @param application_id 应用id
 * @param bot_messages 消息
 */
export declare const apiSaveBotMessages: (application_id: string, bot_messages: BotMessages) => Promise<void>;
/**
 * 获取bot消息
 * @param application_id 应用id
 */
export declare const apiGetBotMessages: (application_id: string) => Promise<BotMessagesResponse>;
