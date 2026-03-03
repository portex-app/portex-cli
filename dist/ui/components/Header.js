import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { t } from '../../locales/index.js';
import { isLoggedIn } from '../../services/auth.js';
const pkg = { version: process.env.npm_package_version ?? '0.1.4' };
export function Header() {
    const loggedIn = isLoggedIn();
    return (_jsxs(Box, { borderStyle: "round", borderColor: "cyan", paddingX: 1, width: 60, children: [_jsxs(Box, { flexGrow: 1, children: [_jsx(Text, { bold: true, color: "cyan", children: t('header.title') }), _jsxs(Text, { color: "gray", children: ["  v", pkg.version] })] }), _jsx(Box, { children: loggedIn
                    ? _jsxs(Text, { color: "green", children: ["\u25CF ", t('header.loggedIn')] })
                    : _jsxs(Text, { color: "red", children: ["\u25CB ", t('header.notLoggedIn')] }) })] }));
}
