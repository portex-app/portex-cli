import { Box, Text } from 'ink'
import React from 'react'

import { t } from '../../locales/index.js'
import { isLoggedIn } from '../../services/auth.js'

const pkg = { version: process.env.npm_package_version ?? '0.1.4' }

export function Header() {
    const loggedIn = isLoggedIn()
    return (
        <Box borderStyle="round" borderColor="cyan" paddingX={1} width={60}>
            <Box flexGrow={1}>
                <Text bold color="cyan">{t('header.title')}</Text>
                <Text color="gray">  v{pkg.version}</Text>
            </Box>
            <Box>
                {loggedIn
                    ? <Text color="green">● {t('header.loggedIn')}</Text>
                    : <Text color="red">○ {t('header.notLoggedIn')}</Text>
                }
            </Box>
        </Box>
    )
}
