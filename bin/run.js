#!/usr/bin/env node

import { run, flush, handle } from '@oclif/core'

// If no command given (and not --help/--version), launch TUI directly
const args = process.argv.slice(2)
const positional = args.filter(a => !a.startsWith('-'))
const hasHelpOrVersion = args.some(a => a === '--help' || a === '-h' || a === '--version' || a === '-v')

if (positional.length === 0 && !hasHelpOrVersion) {
    const { initConfig } = await import('../dist/hooks/init.js')
    const { setLocale } = await import('../dist/locales/index.js')
    const { readGlobalConfig } = await import('../dist/services/config.js')

    initConfig()

    const langIdx = process.argv.indexOf('--lang')
    if (langIdx !== -1 && (process.argv[langIdx + 1] === 'zh' || process.argv[langIdx + 1] === 'en')) {
        setLocale(process.argv[langIdx + 1])
    } else {
        const cfg = readGlobalConfig()
        if (cfg.defaultLang) setLocale(cfg.defaultLang)
    }

    const React = (await import('react')).default
    const { render } = await import('ink')
    const { App } = await import('../dist/ui/App.js')
    render(React.createElement(App))
} else {
    await run(process.argv.slice(2), import.meta.url)
        .catch(handle)
        .finally(() => flush())
}
