import { createRequire } from 'node:module';
import { initConfig } from './hooks/init.js';
import { setLocale } from './locales/index.js';
import { readGlobalConfig } from './services/config.js';
async function main() {
    // 初始化 ~/.portex/ 目录结构
    initConfig();
    // 语言优先级：--lang flag > 全局配置 > 系统 LANG
    const args = process.argv.slice(2);
    const langIndex = args.indexOf('--lang');
    if (langIndex !== -1 && args[langIndex + 1]) {
        const lang = args[langIndex + 1];
        if (lang === 'zh' || lang === 'en')
            setLocale(lang);
    }
    else {
        const globalConfig = readGlobalConfig();
        if (globalConfig.defaultLang)
            setLocale(globalConfig.defaultLang);
    }
    // 版本更新提示（非阻塞）
    const require = createRequire(import.meta.url);
    const pkg = require('../package.json');
    const { default: updateNotifier } = await import('update-notifier');
    updateNotifier({ pkg }).notify();
    // 分发：UI 模式 or CLI 模式
    const cliArgs = args.filter((a, i) => a !== '--lang' && args[langIndex] !== '--lang' || i !== langIndex + 1);
    if (cliArgs[0] === 'ui') {
        process.env._PORTEX_TUI_MODE_ = '1';
        const React = (await import('react')).default;
        const { render } = await import('ink');
        const { App } = await import('./ui/App.js');
        render(React.createElement(App));
    }
    else {
        const { runCLI } = await import('./cli/index.js');
        await runCLI(process.argv);
    }
}
main().catch(err => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
});
