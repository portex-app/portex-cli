import fs from 'node:fs'
import path from 'node:path'
import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import SelectInput from 'ink-select-input'
import { useEffect, useState } from 'react'

import { t } from '../../locales/index.js'
import { logout } from '../../services/auth.js'
import { getApplicationInfo } from '../../services/app.js'
import { getBotInfo } from '../../services/bot.js'
import { readProjectConfig } from '../../services/config.js'
import { useApp, type Screen } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

const CONFIG_DIR = path.join(process.cwd(), '.portex')

// env number → label/color
const ENV = [
    { key: 'dev',  label: 'dev ',  color: 'green'  },
    { key: 'test', label: 'test', color: 'yellow' },
    { key: 'prod', label: 'prod', color: 'red'    },
] as const

interface ProjectState {
    app: Application
    botName?: string
}

type LoadState = 'loading' | 'ready' | 'error'

function previewUrl(appName: string, env: string): string {
    return env === 'prod'
        ? `https://${appName}.portex.app`
        : `https://${appName}.${env}.portex.app`
}

export function Dashboard() {
    const { setScreen, setLoggedIn, lang, toggleLang } = useApp()
    const cfg = readProjectConfig()
    const [loadState, setLoadState] = useState<LoadState>('loading')
    const [project, setProject] = useState<ProjectState | null>(null)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        async function load() {
            try {
                const app = await getApplicationInfo({ application_name: cfg.appName })
                let botName: string | undefined
                if (app.platform_name === 'Telegram') {
                    try {
                        const bot = await getBotInfo(app.id)
                        botName = bot.name
                    } catch { /* bot not bound yet */ }
                }
                setProject({ app, botName })
                setLoadState('ready')
            } catch (e) {
                setErrorMsg(e instanceof Error ? e.message : t('common.unknownError'))
                setLoadState('error')
            }
        }
        load()
    }, [cfg.appName])

    // 监听 .portex 目录变化，若 appName 消失则立即返回 setup
    useEffect(() => {
        if (!fs.existsSync(CONFIG_DIR)) return
        const watcher = fs.watch(CONFIG_DIR, { persistent: false }, () => {
            if (!readProjectConfig().appName) setScreen('setup')
        })
        return () => watcher.close()
    }, [])

    useInput((input, key) => {
        if (input === 'q' || key.escape) process.exit(0)
        if (input === 'l' || input === 'L') toggleLang()
    })

    function handleSelect(item: { label: string; value: string }) {
        if (item.value === 'quit') process.exit(0)
        if (item.value === 'logout') {
            logout()
            setLoggedIn(false)
            setScreen('login')
            return
        }
        setScreen(item.value as Screen)
    }

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loadState === 'loading') {
        return (
            <Box flexDirection="column" gap={1}>
                <Header />
                <Box borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={64}>
                    <Text color="cyan"><Spinner type="dots" /></Text>
                    <Text>  {t('common.loading')}</Text>
                </Box>
            </Box>
        )
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (loadState === 'error' || !project) {
        return (
            <Box flexDirection="column" gap={1}>
                <Header />
                <Box flexDirection="column" borderStyle="round" borderColor="red" paddingX={2} paddingY={1} width={64}>
                    <Text color="red">✗ {errorMsg}</Text>
                    <Box height={1} />
                    <SelectInput
                        items={[
                            { label: t('link.title'), value: 'link'   },
                            { label: t('dashboard.menu.logout'), value: 'logout' },
                        ]}
                        onSelect={handleSelect}
                    />
                </Box>
            </Box>
        )
    }

    // ── Project Dashboard ────────────────────────────────────────────────────
    const { app, botName } = project
    const vmap = new Map<number, number>()
    for (const v of app.published_versions ?? []) {
        vmap.set(v.env, v.version)
    }
    const isTelegram = app.platform_name === 'Telegram'

    const actions = [
        { label: t('dashboard.menu.deploy'),  value: 'deploy'  },
        { label: t('dashboard.menu.publish'), value: 'publish' },
        ...(isTelegram ? [{ label: t('dashboard.menu.bot'), value: 'bot' }] : []),
        { label: '─────────────────────', value: '_sep' },
        { label: t('dashboard.menu.logout'),   value: 'logout'  },
        { label: t('dashboard.menu.quit'),     value: 'quit'    },
    ]

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={64}>

                {/* ── 项目名 + 平台 + 最新版本 ── */}
                <Box justifyContent="space-between">
                    <Box gap={1}>
                        <Text bold color="white">{app.name}</Text>
                        <Text color="gray">·</Text>
                        <Text color="cyan">{app.platform_name}</Text>
                    </Box>
                    <Text color="gray">
                        {t('deploy.version')}: <Text color="white" bold>v{app.last_version}</Text>
                    </Text>
                </Box>

                {/* ── 环境状态 ── */}
                <Box height={1} />
                {ENV.map(({ key, label, color }, idx) => {
                    const ver = vmap.get(idx)
                    const url = previewUrl(app.name, key)
                    return (
                        <Box key={key} gap={2}>
                            <Text color={color} bold>{label}</Text>
                            {ver !== undefined
                                ? <>
                                    <Text color="white">v{ver}</Text>
                                    <Text color="gray" dimColor>{url}</Text>
                                  </>
                                : <Text color="gray" dimColor>—  {t('dashboard.notPublished')}</Text>
                            }
                        </Box>
                    )
                })}

                {/* ── Bot 状态（仅 Telegram）── */}
                {isTelegram && (
                    <Box marginTop={1} gap={1}>
                        <Text color="gray">Bot:</Text>
                        {botName
                            ? <Text color="green">{botName}</Text>
                            : <Text color="gray" dimColor>{t('dashboard.botNotConnected')}  <Text color="yellow">{t('dashboard.botRegisterHint')}</Text></Text>
                        }
                    </Box>
                )}

                {/* ── 分隔线 + 操作菜单 ── */}
                <Box marginTop={1}>
                    <Text color="gray">{'─'.repeat(58)}</Text>
                </Box>
                <SelectInput
                    items={actions}
                    onSelect={(item) => {
                        if (item.value === '_sep') return
                        handleSelect(item)
                    }}
                    isFocused
                />
            </Box>

            <Text color="gray">{t('hint.nav', { lang: lang === 'zh' ? 'EN' : '中文' })}</Text>
        </Box>
    )
}
