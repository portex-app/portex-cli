export declare function getBotInfo(applicationId: string): Promise<TelegramBotInfo>;
export declare function registerBot(applicationId: string, botToken: string): Promise<void>;
export declare function getBotMessages(applicationId: string): Promise<BotMessages>;
export declare function saveBotMessages(applicationId: string, messages: BotMessages): Promise<void>;
export declare function setMenuButton(applicationId: string, url: string, name: string): Promise<void>;
export declare function getDefaultMessageTemplate(): BotMessages;
