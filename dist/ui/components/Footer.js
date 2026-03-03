import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { t } from '../../locales/index.js';
export function Footer() {
    return (_jsx(Box, { borderStyle: "round", borderColor: "gray", paddingX: 1, width: 60, children: _jsx(Text, { color: "gray", children: t('footer.hint') }) }));
}
