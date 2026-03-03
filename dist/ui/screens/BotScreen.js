import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import { useEffect, useState } from 'react';
import { t } from '../../locales/index.js';
import { getApplicationInfo } from '../../services/app.js';
import { getBotInfo, registerBot, setMenuButton } from '../../services/bot.js';
import { readProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
const MENU_ITEMS = [
    { label: t('bot.menu.register'), value: 'register' },
    { label: t('bot.menu.info'), value: 'info' },
    { label: t('bot.menu.menuButton'), value: 'menuButton' },
    { label: t('bot.menu.back'), value: 'back' },
];
export function BotScreen() {
    const { setScreen } = useApp();
    const cfg = readProjectConfig();
    const [appId, setAppId] = useState('');
    const [appName] = useState(cfg.appName ?? '');
    const [view, setView] = useState('menu');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    // Register fields
    const [botToken, setBotToken] = useState('');
    // MenuButton fields
    const [menuName, setMenuName] = useState('open');
    const [menuUrl, setMenuUrl] = useState('');
    const [menuField, setMenuField] = useState('name');
    // Info data
    const [botData, setBotData] = useState(null);
    useEffect(() => {
        if (!appName)
            return;
        getApplicationInfo({ application_name: appName })
            .then(app => setAppId(app.id))
            .catch(() => setMessage(t('error.appNotFound')));
    }, [appName]);
    useInput((_, key) => {
        if (key.escape) {
            if (view !== 'menu') {
                setView('menu');
                setStatus('idle');
                setMessage('');
            }
            else
                setScreen('dashboard');
        }
    });
    async function handleMenuSelect(item) {
        if (item.value === 'back') {
            setScreen('dashboard');
            return;
        }
        setView(item.value);
        setStatus('idle');
        setMessage('');
        if (item.value === 'info') {
            setStatus('loading');
            try {
                const info = await getBotInfo(appId);
                setBotData(info);
                setStatus('done');
            }
            catch {
                setMessage(t('bot.notBound'));
                setStatus('error');
            }
        }
    }
    async function handleRegisterSubmit() {
        if (!botToken)
            return;
        setStatus('loading');
        try {
            await registerBot(appId, botToken);
            setMessage(t('bot.register.success'));
            setStatus('done');
        }
        catch {
            setMessage(t('bot.register.failed'));
            setStatus('error');
        }
    }
    async function handleMenuButtonSubmit() {
        if (!menuUrl)
            return;
        setStatus('loading');
        try {
            await setMenuButton(appId, menuUrl, menuName);
            setMessage(t('bot.menuButton.success'));
            setStatus('done');
        }
        catch {
            setMessage(t('bot.menuButton.failed'));
            setStatus('error');
        }
    }
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 60, children: [_jsx(Text, { bold: true, color: "cyan", children: t('bot.title') }), appName && _jsxs(Text, { color: "gray", children: ["App: ", _jsx(Text, { color: "white", children: appName })] }), _jsx(Box, { height: 1 }), view === 'menu' && (_jsx(SelectInput, { items: MENU_ITEMS, onSelect: handleMenuSelect })), view === 'info' && (_jsxs(Box, { flexDirection: "column", gap: 1, children: [status === 'loading' && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { children: t('bot.info.loading') })] })), status === 'done' && botData && (_jsxs(_Fragment, { children: [_jsxs(Text, { children: [t('bot.info.name'), ": ", _jsx(Text, { color: "cyan", children: botData.name })] }), _jsxs(Text, { children: [t('bot.info.description'), ": ", _jsx(Text, { color: "white", children: botData.description })] }), _jsxs(Text, { children: [t('bot.info.shortDescription'), ": ", _jsx(Text, { color: "white", children: botData.short_description })] })] })), status === 'error' && _jsxs(Text, { color: "red", children: ["\u2717 ", message] })] })), view === 'register' && (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: '>' }), _jsxs(Text, { children: [t('bot.register.token'), ": "] }), _jsx(TextInput, { value: botToken, onChange: setBotToken, onSubmit: handleRegisterSubmit, focus: status === 'idle' })] }), status === 'loading' && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { children: t('bot.register.registering') })] })), status === 'done' && _jsxs(Text, { color: "green", children: ["\u2713 ", message] }), status === 'error' && _jsxs(Text, { color: "red", children: ["\u2717 ", message] })] })), view === 'menuButton' && (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: menuField === 'name' ? 'cyan' : 'gray', children: '>' }), _jsxs(Text, { children: [t('bot.menuButton.name'), ": "] }), menuField === 'name'
                                        ? _jsx(TextInput, { value: menuName, onChange: setMenuName, onSubmit: () => setMenuField('url'), focus: true })
                                        : _jsx(Text, { color: "green", children: menuName })] }), menuField === 'url' && (_jsxs(Box, { gap: 1, marginTop: 1, children: [_jsx(Text, { color: "cyan", children: '>' }), _jsxs(Text, { children: [t('bot.menuButton.url'), ": "] }), _jsx(TextInput, { value: menuUrl, onChange: setMenuUrl, onSubmit: handleMenuButtonSubmit, focus: true })] })), status === 'loading' && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { children: t('bot.menuButton.updating') })] })), status === 'done' && _jsxs(Text, { color: "green", children: ["\u2713 ", message] }), status === 'error' && _jsxs(Text, { color: "red", children: ["\u2717 ", message] })] }))] }), _jsx(Text, { color: "gray", children: view === 'menu' ? t('hint.bot.menu') : t('hint.bot.form') })] }));
}
