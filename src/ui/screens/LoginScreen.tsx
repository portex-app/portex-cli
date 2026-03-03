import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import TextInput from 'ink-text-input'
import React, { useState } from 'react'

import { t } from '../../locales/index.js'
import { login } from '../../services/auth.js'
import { readProjectConfig } from '../../services/config.js'
import { useApp } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

type Field = 'account' | 'password'

export function LoginScreen() {
    const { setScreen, setLoggedIn } = useApp()
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [focus, setFocus] = useState<Field>('account')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useInput((_, key) => {
        if (loading) return
        if (key.return) {
            if (focus === 'account') {
                setFocus('password')
            } else {
                handleLogin()
            }
        }
        if (key.tab) {
            setFocus(f => f === 'account' ? 'password' : 'account')
        }
    })

    async function handleLogin() {
        if (!account || !password) { setError('Account and password are required'); return }
        setLoading(true)
        setError('')
        try {
            await login(account, password)
            setLoggedIn(true)
            const cfg = readProjectConfig()
            setScreen(cfg.appName ? 'dashboard' : 'setup')
        } catch {
            setError(t('login.failed'))
            setLoading(false)
        }
    }

    return (
        <Box flexDirection="column" gap={1}>
            <Header />

            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={60}>
                <Text bold color="cyan">{t('login.title')}</Text>
                <Box height={1} />

                <Box gap={1}>
                    <Text color={focus === 'account' ? 'cyan' : 'gray'}>{'>'}</Text>
                    <Text>{t('login.account')}: </Text>
                    <TextInput
                        value={account}
                        onChange={setAccount}
                        onSubmit={() => setFocus('password')}
                        focus={focus === 'account' && !loading}
                    />
                </Box>

                <Box gap={1} marginTop={1}>
                    <Text color={focus === 'password' ? 'cyan' : 'gray'}>{'>'}</Text>
                    <Text>{t('login.password')}: </Text>
                    <TextInput
                        value={password}
                        onChange={setPassword}
                        onSubmit={handleLogin}
                        focus={focus === 'password' && !loading}
                        mask="*"
                    />
                </Box>

                <Box marginTop={1}>
                    {loading && (
                        <Box gap={1}>
                            <Text color="green"><Spinner type="dots" /></Text>
                            <Text color="green">{t('login.loggingIn')}</Text>
                        </Box>
                    )}
                    {error && <Text color="red">{error}</Text>}
                </Box>
            </Box>

            <Text color="gray">{t('hint.login')}</Text>
        </Box>
    )
}
