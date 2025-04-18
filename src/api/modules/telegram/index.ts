
import Http from "../../index.js";


/**
 * tg应用判定机器人token
 * @param application_id 要绑定机器人的应用id
 * @param tg_bot_token 机器人的token
 */
export const apiBindBot = async (application_id: string, tg_bot_token: string) => {
    const url = `/v1/applications/${application_id}/tg-bots/sync`
    return Http.post<void>(url, { tg_bot_token });
}

/**
 * 获取机器人信息
 * @param application_id 应用id
 * @returns
 */

export const apiGetBot = async (application_id: string) => {
    const url = `/v1/applications/${application_id}/tg-bots`
    return Http.get<TelegramBotInfo>(url);
}

/**
 * 修改机器人信息
 * @param application_id 应用id
 * @param params 修改机器人基本信息
 */
export const apiUpdateBot = async (application_id: string, params: BaseBotInfo) => {
    const url = `/v1/applications/${application_id}/tg/set-bot`
    return Http.post<void>(url, params);
}

/**
 * 修改菜单按钮
 * @param application_id 应用id
 * @param button_url 按钮链接
 * @param button_name 按钮名称 
 */
export const apiUpdateMenuButton = async (application_id: string, button_url: string, button_name: string = 'open') => {
    const url = `/v1/applications/${application_id}/tg-bots/menu-button`
    return Http.put<void>(url, { button_name, button_url });
}

/**
 * 新增机器人消息
 * @param application_id 应用id
 * @param bot_messages 消息
 */
export const apiSaveBotMessages = async (application_id: string, bot_messages: BotMessages) => {
    const url = `/v1/applications/${application_id}/tg-bots/commands`
    return Http.post<void>(url, bot_messages);
}


/**
 * 获取bot消息
 * @param application_id 应用id
 */
export const apiGetBotMessages = async (application_id: string) => {
    const url = `/v1/applications/${application_id}/tg-bots/commands`
    return Http.get<BotMessagesResponse>(url);
}
