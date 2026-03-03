import { en } from './en.js'
import { zh } from './zh.js'

export type Locale = 'zh' | 'en'

let currentLocale: Locale = detectLocale()

function detectLocale(): Locale {
    const lang = process.env.LANG || process.env.LANGUAGE || ''
    return lang.startsWith('zh') ? 'zh' : 'en'
}

export function setLocale(locale: Locale): void {
    currentLocale = locale
}

export function getLocale(): Locale {
    return currentLocale
}

export function t(key: string, vars?: Record<string, string | number>): string {
    const strings = currentLocale === 'zh' ? zh : en
    let str = strings[key] ?? key
    if (vars) {
        for (const [k, v] of Object.entries(vars)) {
            str = str.replace(`{${k}}`, String(v))
        }
    }
    return str
}
