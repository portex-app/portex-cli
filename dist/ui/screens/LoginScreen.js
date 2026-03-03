import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import { useState } from 'react';
import { t } from '../../locales/index.js';
import { login } from '../../services/auth.js';
import { readProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
export function LoginScreen() {
    const { setScreen, setLoggedIn } = useApp();
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [focus, setFocus] = useState('account');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useInput((_, key) => {
        if (loading)
            return;
        if (key.return) {
            if (focus === 'account') {
                setFocus('password');
            }
            else {
                handleLogin();
            }
        }
        if (key.tab) {
            setFocus(f => f === 'account' ? 'password' : 'account');
        }
    });
    async function handleLogin() {
        if (!account || !password) {
            setError('Account and password are required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await login(account, password);
            setLoggedIn(true);
            const cfg = readProjectConfig();
            setScreen(cfg.appName ? 'dashboard' : 'setup');
        }
        catch {
            setError(t('login.failed'));
            setLoading(false);
        }
    }
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 60, children: [_jsx(Text, { bold: true, color: "cyan", children: t('login.title') }), _jsx(Box, { height: 1 }), _jsxs(Box, { gap: 1, children: [_jsx(Text, { color: focus === 'account' ? 'cyan' : 'gray', children: '>' }), _jsxs(Text, { children: [t('login.account'), ": "] }), _jsx(TextInput, { value: account, onChange: setAccount, onSubmit: () => setFocus('password'), focus: focus === 'account' && !loading })] }), _jsxs(Box, { gap: 1, marginTop: 1, children: [_jsx(Text, { color: focus === 'password' ? 'cyan' : 'gray', children: '>' }), _jsxs(Text, { children: [t('login.password'), ": "] }), _jsx(TextInput, { value: password, onChange: setPassword, onSubmit: handleLogin, focus: focus === 'password' && !loading, mask: "*" })] }), _jsxs(Box, { marginTop: 1, children: [loading && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "green", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { color: "green", children: t('login.loggingIn') })] })), error && _jsx(Text, { color: "red", children: error })] })] }), _jsx(Text, { color: "gray", children: t('hint.login') })] }));
}
