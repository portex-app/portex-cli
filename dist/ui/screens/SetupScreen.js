import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import path from 'node:path';
import { t } from '../../locales/index.js';
import { logout } from '../../services/auth.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
export function SetupScreen() {
    const { setScreen, setLoggedIn, lang, toggleLang } = useApp();
    const cwd = process.cwd();
    const items = [
        { label: t('dashboard.menu.new'), value: 'newApp', description: 'Create a new mini-app in this directory' },
        { label: t('link.title'), value: 'link', description: 'Connect to an existing app' },
        { label: t('dashboard.menu.list'), value: 'appList', description: 'Browse all your apps' },
        { label: t('dashboard.menu.logout'), value: 'logout' },
        { label: t('dashboard.menu.quit'), value: 'quit' },
    ];
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
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "yellow", paddingX: 2, paddingY: 1, width: 64, children: [_jsx(Text, { bold: true, color: "yellow", children: t('setup.noProject') }), _jsxs(Text, { color: "gray", children: [path.basename(cwd), "  ", _jsx(Text, { color: "gray", dimColor: true, children: cwd })] }), _jsx(Box, { height: 1 }), _jsxs(Text, { color: "gray", children: [t('setup.runHint'), " ", _jsx(Text, { color: "cyan", children: "portex new" }), " ", t('setup.runOr'), " ", _jsx(Text, { color: "cyan", children: "portex link" }), " ", t('setup.runGetStarted'), "."] }), _jsx(Box, { height: 1 }), _jsx(SelectInput, { items: items, onSelect: handleSelect })] }), _jsx(Text, { color: "gray", children: t('hint.nav', { lang: lang === 'zh' ? 'EN' : '中文' }) })] }));
}
