import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from 'ink';
import { useEffect } from 'react';
import { isLoggedIn } from '../services/auth.js';
import { readProjectConfig } from '../services/config.js';
import { AppProvider, useApp } from './context/AppContext.js';
import { Dashboard } from './screens/Dashboard.js';
import { SetupScreen } from './screens/SetupScreen.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { DeployScreen } from './screens/DeployScreen.js';
import { PublishScreen } from './screens/PublishScreen.js';
import { AppListScreen } from './screens/AppListScreen.js';
import { NewAppScreen } from './screens/NewAppScreen.js';
import { LinkScreen } from './screens/LinkScreen.js';
import { BotScreen } from './screens/BotScreen.js';
function Router() {
    const { screen, setScreen, setLoggedIn } = useApp();
    useEffect(() => {
        if (!isLoggedIn()) {
            setScreen('login');
            return;
        }
        setLoggedIn(true);
        // 有 .portex 且有 appName → 项目控制中心，否则 → 引导页
        const cfg = readProjectConfig();
        setScreen(cfg.appName ? 'dashboard' : 'setup');
    }, []);
    return (_jsxs(Box, { flexDirection: "column", children: [screen === 'login' && _jsx(LoginScreen, {}), screen === 'setup' && _jsx(SetupScreen, {}), screen === 'dashboard' && _jsx(Dashboard, {}), screen === 'deploy' && _jsx(DeployScreen, {}), screen === 'publish' && _jsx(PublishScreen, {}), screen === 'appList' && _jsx(AppListScreen, {}), screen === 'newApp' && _jsx(NewAppScreen, {}), screen === 'link' && _jsx(LinkScreen, {}), screen === 'bot' && _jsx(BotScreen, {})] }));
}
export function App() {
    return (_jsx(AppProvider, { children: _jsx(Router, {}) }));
}
