import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import SelectInput from 'ink-select-input'
import TextInput from 'ink-text-input'
import React, { useEffect, useState } from 'react'

import { t } from '../../locales/index.js'
import { getApplicationInfo } from '../../services/app.js'
import { getBotInfo, registerBot, setMenuButton } from '../../services/bot.js'
import { readProjectConfig } from '../../services/config.js'
import { useApp } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

type BotView = 'menu' | 'info' | 'register' | 'menuButton'
type Status = 'idle' | 'loading' | 'done' | 'error'

const MENU_ITEMS = [
    { label: t('bot.menu.register'),    value: 'register'    },
    { label: t('bot.menu.info'),        value: 'info'        },
    { label: t('bot.menu.menuButton'),  value: 'menuButton'  },
    { label: t('bot.menu.back'),        value: 'back'        },
]

export function BotScreen() {
    const { setScreen } = useApp()
    const cfg = readProjectConfig()
    const [appId, setAppId] = useState('')
    const [appName] = useState(cfg.appName ?? '')
    const [view, setView] = useState<BotView>('menu')
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')

    // Register fields
    const [botToken, setBotToken] = useState('')
    // MenuButton fields
    const [menuName, setMenuName] = useState('open')
    const [menuUrl, setMenuUrl] = useState('')
    const [menuField, setMenuField] = useState<'name' | 'url'>('name')
    // Info data
    const [botData, setBotData] = useState<TelegramBotInfo | null>(null)

    useEffect(() => {
        if (!appName) return
        getApplicationInfo({ application_name: appName })
            .then(app => setAppId(app.id))
            .catch(() => setMessage(t('error.appNotFound')))
    }, [appName])

    useInput((_, key) => {
        if (key.escape) {
            if (view !== 'menu') { setView('menu'); setStatus('idle'); setMessage('') }
            else setScreen('dashboard')
        }
    })

    async function handleMenuSelect(item: { label: string; value: string }) {
        if (item.value === 'back') { setScreen('dashboard'); return }
        setView(item.value as BotView)
        setStatus('idle')
        setMessage('')

        if (item.value === 'info') {
            setStatus('loading')
            try {
                const info = await getBotInfo(appId)
                setBotData(info)
                setStatus('done')
            } catch {
                setMessage(t('bot.notBound'))
                setStatus('error')
            }
        }
    }

    async function handleRegisterSubmit() {
        if (!botToken) return
        setStatus('loading')
        try {
            await registerBot(appId, botToken)
            setMessage(t('bot.register.success'))
            setStatus('done')
        } catch {
            setMessage(t('bot.register.failed'))
            setStatus('error')
        }
    }

    async function handleMenuButtonSubmit() {
        if (!menuUrl) return
        setStatus('loading')
        try {
            await setMenuButton(appId, menuUrl, menuName)
            setMessage(t('bot.menuButton.success'))
            setStatus('done')
        } catch {
            setMessage(t('bot.menuButton.failed'))
            setStatus('error')
        }
    }

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={60}>
                <Text bold color="cyan">{t('bot.title')}</Text>
                {appName && <Text color="gray">App: <Text color="white">{appName}</Text></Text>}
                <Box height={1} />

                {view === 'menu' && (
                    <SelectInput items={MENU_ITEMS} onSelect={handleMenuSelect} />
                )}

                {view === 'info' && (
                    <Box flexDirection="column" gap={1}>
                        {status === 'loading' && (
                            <Box gap={1}><Text color="cyan"><Spinner type="dots" /></Text><Text>{t('bot.info.loading')}</Text></Box>
                        )}
                        {status === 'done' && botData && (
                            <>
                                <Text>{t('bot.info.name')}: <Text color="cyan">{botData.name}</Text></Text>
                                <Text>{t('bot.info.description')}: <Text color="white">{botData.description}</Text></Text>
                                <Text>{t('bot.info.shortDescription')}: <Text color="white">{botData.short_description}</Text></Text>
                            </>
                        )}
                        {status === 'error' && <Text color="red">✗ {message}</Text>}
                    </Box>
                )}

                {view === 'register' && (
                    <Box flexDirection="column" gap={1}>
                        <Box gap={1}>
                            <Text color="cyan">{'>'}</Text>
                            <Text>{t('bot.register.token')}: </Text>
                            <TextInput
                                value={botToken}
                                onChange={setBotToken}
                                onSubmit={handleRegisterSubmit}
                                focus={status === 'idle'}
                            />
                        </Box>
                        {status === 'loading' && (
                            <Box gap={1}><Text color="cyan"><Spinner type="dots" /></Text><Text>{t('bot.register.registering')}</Text></Box>
                        )}
                        {status === 'done' && <Text color="green">✓ {message}</Text>}
                        {status === 'error' && <Text color="red">✗ {message}</Text>}
                    </Box>
                )}

                {view === 'menuButton' && (
                    <Box flexDirection="column" gap={1}>
                        <Box gap={1}>
                            <Text color={menuField === 'name' ? 'cyan' : 'gray'}>{'>'}</Text>
                            <Text>{t('bot.menuButton.name')}: </Text>
                            {menuField === 'name'
                                ? <TextInput value={menuName} onChange={setMenuName} onSubmit={() => setMenuField('url')} focus />
                                : <Text color="green">{menuName}</Text>
                            }
                        </Box>
                        {menuField === 'url' && (
                            <Box gap={1} marginTop={1}>
                                <Text color="cyan">{'>'}</Text>
                                <Text>{t('bot.menuButton.url')}: </Text>
                                <TextInput value={menuUrl} onChange={setMenuUrl} onSubmit={handleMenuButtonSubmit} focus />
                            </Box>
                        )}
                        {status === 'loading' && (
                            <Box gap={1}><Text color="cyan"><Spinner type="dots" /></Text><Text>{t('bot.menuButton.updating')}</Text></Box>
                        )}
                        {status === 'done' && <Text color="green">✓ {message}</Text>}
                        {status === 'error' && <Text color="red">✗ {message}</Text>}
                    </Box>
                )}
            </Box>

            <Text color="gray">{view === 'menu' ? t('hint.bot.menu') : t('hint.bot.form')}</Text>
        </Box>
    )
}
