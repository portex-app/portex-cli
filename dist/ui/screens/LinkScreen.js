import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import { useEffect, useMemo, useState } from 'react';
import { t } from '../../locales/index.js';
import { listApplications } from '../../services/app.js';
import { readProjectConfig, writeProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
const PAGE_SIZE = 8;
export function LinkScreen() {
    const { setScreen } = useApp();
    const [step, setStep] = useState('loading');
    const [allApps, setAllApps] = useState([]);
    const [appIdMap, setAppIdMap] = useState({});
    const [query, setQuery] = useState('');
    const [focus, setFocus] = useState('list');
    const [page, setPage] = useState(0);
    const [cursor, setCursor] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        listApplications()
            .then(list => {
            if (!list.length) {
                setErrorMsg(t('error.appNotFound'));
                setStep('error');
                return;
            }
            const idMap = {};
            list.forEach(a => { idMap[a.name] = a.id; });
            setAppIdMap(idMap);
            setAllApps(list.map(a => ({
                label: `${a.name}  (${a.platform_name})`,
                value: a.name,
            })));
            setStep('list');
        })
            .catch(() => { setErrorMsg(t('common.networkError')); setStep('error'); });
    }, []);
    const filtered = useMemo(() => {
        if (!query.trim())
            return allApps;
        const q = query.toLowerCase();
        return allApps.filter(a => a.value.toLowerCase().includes(q));
    }, [allApps, query]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const pageApps = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
    const safeCursor = Math.min(cursor, Math.max(0, pageApps.length - 1));
    useEffect(() => { setPage(0); setCursor(0); }, [query]);
    const backScreen = readProjectConfig().appName ? 'dashboard' : 'setup';
    useInput((input, key) => {
        if (key.escape) {
            if (focus === 'search') {
                setFocus('list');
                return;
            }
            setScreen(backScreen);
            return;
        }
        if (key.tab) {
            setFocus(f => f === 'list' ? 'search' : 'list');
            return;
        }
        if (focus === 'search')
            return;
        if (key.upArrow) {
            setCursor(c => Math.max(0, c - 1));
            return;
        }
        if (key.downArrow) {
            setCursor(c => Math.min(pageApps.length - 1, c + 1));
            return;
        }
        if (key.leftArrow) {
            setPage(p => Math.max(0, p - 1));
            setCursor(0);
            return;
        }
        if (key.rightArrow) {
            setPage(p => Math.min(totalPages - 1, p + 1));
            setCursor(0);
            return;
        }
        if (key.return && pageApps[safeCursor]) {
            const item = pageApps[safeCursor];
            writeProjectConfig({ appId: appIdMap[item.value], appName: item.value, deployPath: './dist' });
            setScreen('dashboard');
            return;
        }
        if (!key.ctrl && !key.meta && input && input.length === 1 && /\S/.test(input)) {
            setQuery(q => q + input);
            setFocus('search');
        }
    });
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 60, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: true, color: "cyan", children: t('link.title') }), step === 'list' && (_jsxs(Text, { color: "gray", children: [safePage + 1, " / ", totalPages, "  (", filtered.length, ")"] }))] }), _jsx(Text, { color: "gray", children: t('link.description') }), _jsx(Box, { height: 1 }), step === 'loading' && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { children: t('list.loading') })] })), step === 'list' && (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: focus === 'search' ? 'cyan' : 'gray', children: "\u2315" }), focus === 'search'
                                        ? _jsx(TextInput, { value: query, onChange: setQuery, onSubmit: () => setFocus('list') })
                                        : _jsx(Text, { color: "gray", children: query || t('link.tabToSearch') })] }), _jsx(Text, { color: "gray", children: '─'.repeat(50) }), pageApps.length > 0
                                ? pageApps.map((app, i) => (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: i === safeCursor ? 'cyan' : 'gray', children: i === safeCursor ? '›' : ' ' }), _jsx(Text, { color: i === safeCursor ? 'white' : 'gray', children: app.label })] }, app.value)))
                                : _jsx(Text, { color: "gray", children: t('list.noResults') }), _jsx(Box, { height: 1 })] })), step === 'error' && (_jsx(Box, { flexDirection: "column", gap: 1, children: _jsxs(Text, { color: "red", children: ["\u2717 ", errorMsg] }) }))] }), _jsx(Text, { color: "gray", children: t('hint.link') })] }));
}
