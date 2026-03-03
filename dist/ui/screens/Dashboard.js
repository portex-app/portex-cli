import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import fs from 'node:fs';
import path from 'node:path';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import { useEffect, useState } from 'react';
import { t } from '../../locales/index.js';
import { logout } from '../../services/auth.js';
import { getApplicationInfo } from '../../services/app.js';
import { getBotInfo } from '../../services/bot.js';
import { readProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
const CONFIG_DIR = path.join(process.cwd(), '.portex');
// env number → label/color
const ENV = [
    { key: 'dev', label: 'dev ', color: 'green' },
    { key: 'test', label: 'test', color: 'yellow' },
    { key: 'prod', label: 'prod', color: 'red' },
];
function previewUrl(appName, env) {
    return env === 'prod'
        ? `https://${appName}.portex.app`
        : `https://${appName}.${env}.portex.app`;
}
export function Dashboard() {
    const { setScreen, setLoggedIn, lang, toggleLang } = useApp();
    const cfg = readProjectConfig();
    const [loadState, setLoadState] = useState('loading');
    const [project, setProject] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        async function load() {
            try {
                const app = await getApplicationInfo({ application_name: cfg.appName });
                let botName;
                if (app.platform_name === 'Telegram') {
                    try {
                        const bot = await getBotInfo(app.id);
                        botName = bot.name;
                    }
                    catch { /* bot not bound yet */ }
                }
                setProject({ app, botName });
                setLoadState('ready');
            }
            catch (e) {
                setErrorMsg(e instanceof Error ? e.message : t('common.unknownError'));
                setLoadState('error');
            }
        }
        load();
    }, [cfg.appName]);
    // 监听 .portex 目录变化，若 appName 消失则立即返回 setup
    useEffect(() => {
        if (!fs.existsSync(CONFIG_DIR))
            return;
        const watcher = fs.watch(CONFIG_DIR, { persistent: false }, () => {
            if (!readProjectConfig().appName)
                setScreen('setup');
        });
        return () => watcher.close();
    }, []);
    useInput((input, key) => {
        if (input === 'q' || key.escape)
            process.exit(0);
        if (input === 'l' || input === 'L')
            toggleLang();
    });
    function handleSelect(item) {
        if (item.value === 'quit')
            process.exit(0);
        if (item.value === 'logout') {
            logout();
            setLoggedIn(false);
            setScreen('login');
            return;
        }
        setScreen(item.value);
    }
    // ── Loading ──────────────────────────────────────────────────────────────
    if (loadState === 'loading') {
        return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 64, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsxs(Text, { children: ["  ", t('common.loading')] })] })] }));
    }
    // ── Error ────────────────────────────────────────────────────────────────
    if (loadState === 'error' || !project) {
        return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "red", paddingX: 2, paddingY: 1, width: 64, children: [_jsxs(Text, { color: "red", children: ["\u2717 ", errorMsg] }), _jsx(Box, { height: 1 }), _jsx(SelectInput, { items: [
                                { label: t('link.title'), value: 'link' },
                                { label: t('dashboard.menu.logout'), value: 'logout' },
                            ], onSelect: handleSelect })] })] }));
    }
    // ── Project Dashboard ────────────────────────────────────────────────────
    const { app, botName } = project;
    const vmap = new Map();
    for (const v of app.published_versions ?? []) {
        vmap.set(v.env, v.version);
    }
    const isTelegram = app.platform_name === 'Telegram';
    const actions = [
        { label: t('dashboard.menu.deploy'), value: 'deploy' },
        { label: t('dashboard.menu.publish'), value: 'publish' },
        ...(isTelegram ? [{ label: t('dashboard.menu.bot'), value: 'bot' }] : []),
        { label: '─────────────────────', value: '_sep' },
        { label: t('dashboard.menu.logout'), value: 'logout' },
        { label: t('dashboard.menu.quit'), value: 'quit' },
    ];
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 64, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsxs(Box, { gap: 1, children: [_jsx(Text, { bold: true, color: "white", children: app.name }), _jsx(Text, { color: "gray", children: "\u00B7" }), _jsx(Text, { color: "cyan", children: app.platform_name })] }), _jsxs(Text, { color: "gray", children: [t('deploy.version'), ": ", _jsxs(Text, { color: "white", bold: true, children: ["v", app.last_version] })] })] }), _jsx(Box, { height: 1 }), ENV.map(({ key, label, color }, idx) => {
                        const ver = vmap.get(idx);
                        const url = previewUrl(app.name, key);
                        return (_jsxs(Box, { gap: 2, children: [_jsx(Text, { color: color, bold: true, children: label }), ver !== undefined
                                    ? _jsxs(_Fragment, { children: [_jsxs(Text, { color: "white", children: ["v", ver] }), _jsx(Text, { color: "gray", dimColor: true, children: url })] })
                                    : _jsxs(Text, { color: "gray", dimColor: true, children: ["\u2014  ", t('dashboard.notPublished')] })] }, key));
                    }), isTelegram && (_jsxs(Box, { marginTop: 1, gap: 1, children: [_jsx(Text, { color: "gray", children: "Bot:" }), botName
                                ? _jsx(Text, { color: "green", children: botName })
                                : _jsxs(Text, { color: "gray", dimColor: true, children: [t('dashboard.botNotConnected'), "  ", _jsx(Text, { color: "yellow", children: t('dashboard.botRegisterHint') })] })] })), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "gray", children: '─'.repeat(58) }) }), _jsx(SelectInput, { items: actions, onSelect: (item) => {
                            if (item.value === '_sep')
                                return;
                            handleSelect(item);
                        }, isFocused: true })] }), _jsx(Text, { color: "gray", children: t('hint.nav', { lang: lang === 'zh' ? 'EN' : '中文' }) })] }));
}
