import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import { useEffect, useMemo, useState } from 'react';
import { t } from '../../locales/index.js';
import { listApplications } from '../../services/app.js';
import { readProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
const PAGE_SIZE = 8;
const col = (s, w) => s.substring(0, w).padEnd(w);
export function AppListScreen() {
    const { setScreen } = useApp();
    const [allApps, setAllApps] = useState([]);
    const [platforms, setPlatforms] = useState(['All']);
    const [platformIdx, setPlatformIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [searching, setSearching] = useState(false);
    useEffect(() => {
        listApplications()
            .then(list => {
            setAllApps(list);
            const unique = Array.from(new Set(list.map(a => a.platform_name))).sort();
            setPlatforms(['All', ...unique]);
            setLoading(false);
        })
            .catch(() => { setError(t('common.networkError')); setLoading(false); });
    }, []);
    const filtered = useMemo(() => {
        const platform = platforms[platformIdx];
        let result = platform !== 'All' ? allApps.filter(a => a.platform_name === platform) : allApps;
        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(a => a.name.toLowerCase().includes(q));
        }
        return result;
    }, [allApps, platforms, platformIdx, query]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const pageApps = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
    useEffect(() => { setPage(0); }, [query, platformIdx]);
    const backScreen = readProjectConfig().appName ? 'dashboard' : 'setup';
    const currentPlatform = platforms[platformIdx] ?? 'All';
    useInput((input, key) => {
        if (key.escape) {
            if (searching) {
                setSearching(false);
                return;
            }
            setScreen(backScreen);
            return;
        }
        if (key.tab) {
            setSearching(s => !s);
            return;
        }
        if (searching)
            return;
        if (key.leftArrow)
            setPage(p => Math.max(0, p - 1));
        if (key.rightArrow)
            setPage(p => Math.min(totalPages - 1, p + 1));
        if (input === 'p') {
            setPlatformIdx(i => (i + 1) % platforms.length);
            return;
        }
        if (input && input.length === 1 && /\S/.test(input)) {
            setQuery(q => q + input);
            setSearching(true);
        }
    });
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: true, color: "cyan", children: t('list.title') }), _jsxs(Box, { gap: 2, children: [!loading && !error && (_jsxs(Text, { color: "gray", children: [safePage + 1, " / ", totalPages, "  (", filtered.length, ")"] })), _jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "gray", children: "platform:" }), _jsx(Text, { color: currentPlatform === 'All' ? 'gray' : 'cyan', children: currentPlatform })] })] })] }), _jsxs(Box, { marginTop: 1, gap: 1, children: [_jsx(Text, { color: searching ? 'cyan' : 'gray', children: "\u2315" }), searching
                                ? _jsx(TextInput, { value: query, onChange: setQuery, onSubmit: () => setSearching(false) })
                                : _jsx(Text, { color: "gray", children: query || t('link.tabToSearch') })] }), _jsx(Box, { height: 1 }), loading && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { children: t('list.loading') })] })), error && _jsxs(Text, { color: "red", children: ["\u2717 ", error] }), !loading && !error && allApps.length === 0 && (_jsx(Text, { color: "gray", children: t('list.empty') })), !loading && !error && allApps.length > 0 && filtered.length === 0 && (_jsx(Text, { color: "gray", children: t('list.noResults') })), !loading && pageApps.length > 0 && (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { bold: true, color: "gray", children: [col(t('list.headers.name'), 18), col(t('list.headers.platform'), 12), col(t('list.headers.lastVersion'), 8), '  ', col(t('list.headers.dev'), 5), col(t('list.headers.test'), 5), col(t('list.headers.prod'), 5)] }), _jsx(Text, { color: "gray", children: '─'.repeat(58) }), pageApps.map(app => {
                                const vmap = {};
                                for (const v of app.published_versions ?? [])
                                    vmap[String(v.env)] = String(v.version);
                                return (_jsx(Box, { children: _jsxs(Text, { children: [col(app.name, 18), _jsx(Text, { color: "gray", children: col(app.platform_name, 12) }), _jsx(Text, { color: "cyan", children: col(String(app.last_version), 8) }), '  ', _jsx(Text, { color: vmap['0'] ? 'green' : 'gray', children: col(vmap['0'] ?? '-', 5) }), _jsx(Text, { color: vmap['1'] ? 'yellow' : 'gray', children: col(vmap['1'] ?? '-', 5) }), _jsx(Text, { color: vmap['2'] ? 'red' : 'gray', children: col(vmap['2'] ?? '-', 5) })] }) }, app.id));
                            })] }))] }), _jsx(Text, { color: "gray", children: t('hint.appList') })] }));
}
