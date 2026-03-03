export type Locale = 'zh' | 'en';
export declare function setLocale(locale: Locale): void;
export declare function getLocale(): Locale;
export declare function t(key: string, vars?: Record<string, string | number>): string;
