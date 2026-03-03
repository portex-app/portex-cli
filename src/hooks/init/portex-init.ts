import type { Hook } from '@oclif/core'
import { initConfig } from '../init.js'
import { setLocale, type Locale } from '../../locales/index.js'
import { readGlobalConfig } from '../../services/config.js'

const hook: Hook<'init'> = async function ({ argv }) {
    initConfig()

    const langIdx = argv.indexOf('--lang')
    if (langIdx !== -1 && (argv[langIdx + 1] === 'zh' || argv[langIdx + 1] === 'en')) {
        setLocale(argv[langIdx + 1] as Locale)
    } else {
        const cfg = readGlobalConfig()
        if (cfg.defaultLang) setLocale(cfg.defaultLang)
    }
}

export default hook
