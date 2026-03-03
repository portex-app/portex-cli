import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
export function ProgressBar({ percent, width = 30, label }) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return (_jsxs(Box, { flexDirection: "column", children: [label && _jsx(Text, { color: "gray", children: label }), _jsxs(Box, { children: [_jsx(Text, { color: "cyan", children: '█'.repeat(filled) }), _jsx(Text, { color: "gray", children: '░'.repeat(empty) }), _jsxs(Text, { color: "white", children: ["  ", percent, "%"] })] })] }));
}
