import { Box, Text, useInput } from 'ink'
import SelectInput from 'ink-select-input'
import React from 'react'
import path from 'node:path'

import { t } from '../../locales/index.js'
import { logout } from '../../services/auth.js'
import { useApp, type Screen } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

interface MenuItem {
    label: string
    value: Screen | 'logout' | 'quit'
    description?: string
}

export function SetupScreen() {
    const { setScreen, setLoggedIn, lang, toggleLang } = useApp()
    const cwd = process.cwd()

    const items: MenuItem[] = [
        { label: t('dashboard.menu.new'),    value: 'newApp',  description: 'Create a new mini-app in this directory' },
        { label: t('link.title'),            value: 'link',    description: 'Connect to an existing app'              },
        { label: t('dashboard.menu.list'),   value: 'appList', description: 'Browse all your apps'                   },
        { label: t('dashboard.menu.logout'), value: 'logout'                                                         },
        { label: t('dashboard.menu.quit'),   value: 'quit'                                                           },
    ]

    useInput((input, key) => {
        if (input === 'q' || key.escape) process.exit(0)
        if (input === 'l' || input === 'L') toggleLang()
    })

    function handleSelect(item: MenuItem) {
        if (item.value === 'quit') process.exit(0)
        if (item.value === 'logout') {
            logout()
            setLoggedIn(false)
            setScreen('login')
            return
        }
        setScreen(item.value as Screen)
    }

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={2} paddingY={1} width={64}>
                <Text bold color="yellow">{t('setup.noProject')}</Text>
                <Text color="gray">{path.basename(cwd)}  <Text color="gray" dimColor>{cwd}</Text></Text>
                <Box height={1} />
                <Text color="gray">{t('setup.runHint')} <Text color="cyan">portex new</Text> {t('setup.runOr')} <Text color="cyan">portex link</Text> {t('setup.runGetStarted')}.</Text>
                <Box height={1} />
                <SelectInput items={items} onSelect={handleSelect} />
            </Box>

            <Text color="gray">{t('hint.nav', { lang: lang === 'zh' ? 'EN' : '中文' })}</Text>
        </Box>
    )
}
