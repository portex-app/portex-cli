import { en } from './en.js';
import { zh } from './zh.js';
let currentLocale = detectLocale();
function detectLocale() {
    const lang = process.env.LANG || process.env.LANGUAGE || '';
    return lang.startsWith('zh') ? 'zh' : 'en';
}
export function setLocale(locale) {
    currentLocale = locale;
}
export function getLocale() {
    return currentLocale;
}
export function t(key, vars) {
    const strings = currentLocale === 'zh' ? zh : en;
    let str = strings[key] ?? key;
    if (vars) {
        for (const [k, v] of Object.entries(vars)) {
            str = str.replace(`{${k}}`, String(v));
        }
    }
    return str;
}
