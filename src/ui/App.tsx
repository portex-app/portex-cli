import { Box } from 'ink'
import React, { useEffect } from 'react'

import { isLoggedIn } from '../services/auth.js'
import { readProjectConfig } from '../services/config.js'
import { AppProvider, useApp } from './context/AppContext.js'
import { Dashboard }     from './screens/Dashboard.js'
import { SetupScreen }   from './screens/SetupScreen.js'
import { LoginScreen }   from './screens/LoginScreen.js'
import { DeployScreen }  from './screens/DeployScreen.js'
import { PublishScreen } from './screens/PublishScreen.js'
import { AppListScreen } from './screens/AppListScreen.js'
import { NewAppScreen }  from './screens/NewAppScreen.js'
import { LinkScreen }    from './screens/LinkScreen.js'
import { BotScreen }     from './screens/BotScreen.js'

function Router() {
    const { screen, setScreen, setLoggedIn } = useApp()

    useEffect(() => {
        if (!isLoggedIn()) {
            setScreen('login')
            return
        }
        setLoggedIn(true)
        // 有 .portex 且有 appName → 项目控制中心，否则 → 引导页
        const cfg = readProjectConfig()
        setScreen(cfg.appName ? 'dashboard' : 'setup')
    }, [])

    return (
        <Box flexDirection="column">
            {screen === 'login'     && <LoginScreen />}
            {screen === 'setup'     && <SetupScreen />}
            {screen === 'dashboard' && <Dashboard />}
            {screen === 'deploy'    && <DeployScreen />}
            {screen === 'publish'   && <PublishScreen />}
            {screen === 'appList'   && <AppListScreen />}
            {screen === 'newApp'    && <NewAppScreen />}
            {screen === 'link'      && <LinkScreen />}
            {screen === 'bot'       && <BotScreen />}
        </Box>
    )
}

export function App() {
    return (
        <AppProvider>
            <Router />
        </AppProvider>
    )
}
