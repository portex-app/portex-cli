import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import TextInput from 'ink-text-input'
import { useEffect, useMemo, useState } from 'react'

import { t } from '../../locales/index.js'
import { listApplications } from '../../services/app.js'
import { readProjectConfig, writeProjectConfig } from '../../services/config.js'
import { useApp } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

type Step = 'loading' | 'list' | 'error'
type Focus = 'search' | 'list'

const PAGE_SIZE = 8

export function LinkScreen() {
    const { setScreen } = useApp()
    const [step, setStep] = useState<Step>('loading')
    const [allApps, setAllApps] = useState<Array<{ label: string; value: string }>>([])
    const [appIdMap, setAppIdMap] = useState<Record<string, string>>({})
    const [query, setQuery] = useState('')
    const [focus, setFocus] = useState<Focus>('list')
    const [page, setPage] = useState(0)
    const [cursor, setCursor] = useState(0)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        listApplications()
            .then(list => {
                if (!list.length) { setErrorMsg(t('error.appNotFound')); setStep('error'); return }
                const idMap: Record<string, string> = {}
                list.forEach(a => { idMap[a.name] = a.id })
                setAppIdMap(idMap)
                setAllApps(list.map(a => ({
                    label: `${a.name}  (${a.platform_name})`,
                    value: a.name,
                })))
                setStep('list')
            })
            .catch(() => { setErrorMsg(t('common.networkError')); setStep('error') })
    }, [])

    const filtered = useMemo(() => {
        if (!query.trim()) return allApps
        const q = query.toLowerCase()
        return allApps.filter(a => a.value.toLowerCase().includes(q))
    }, [allApps, query])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages - 1)
    const pageApps = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)
    const safeCursor = Math.min(cursor, Math.max(0, pageApps.length - 1))

    useEffect(() => { setPage(0); setCursor(0) }, [query])

    const backScreen = readProjectConfig().appName ? 'dashboard' : 'setup'

    useInput((input, key) => {
        if (key.escape) {
            if (focus === 'search') { setFocus('list'); return }
            setScreen(backScreen)
            return
        }
        if (key.tab) { setFocus(f => f === 'list' ? 'search' : 'list'); return }
        if (focus === 'search') return

        if (key.upArrow)    { setCursor(c => Math.max(0, c - 1)); return }
        if (key.downArrow)  { setCursor(c => Math.min(pageApps.length - 1, c + 1)); return }
        if (key.leftArrow)  { setPage(p => Math.max(0, p - 1)); setCursor(0); return }
        if (key.rightArrow) { setPage(p => Math.min(totalPages - 1, p + 1)); setCursor(0); return }
        if (key.return && pageApps[safeCursor]) {
            const item = pageApps[safeCursor]
            writeProjectConfig({ appId: appIdMap[item.value], appName: item.value, deployPath: './dist' })
            setScreen('dashboard')
            return
        }
        if (!key.ctrl && !key.meta && input && input.length === 1 && /\S/.test(input)) {
            setQuery(q => q + input)
            setFocus('search')
        }
    })

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={60}>
                <Box justifyContent="space-between">
                    <Text bold color="cyan">{t('link.title')}</Text>
                    {step === 'list' && (
                        <Text color="gray">{safePage + 1} / {totalPages}  ({filtered.length})</Text>
                    )}
                </Box>
                <Text color="gray">{t('link.description')}</Text>
                <Box height={1} />

                {step === 'loading' && (
                    <Box gap={1}>
                        <Text color="cyan"><Spinner type="dots" /></Text>
                        <Text>{t('list.loading')}</Text>
                    </Box>
                )}

                {step === 'list' && (
                    <Box flexDirection="column">
                        <Box gap={1}>
                            <Text color={focus === 'search' ? 'cyan' : 'gray'}>⌕</Text>
                            {focus === 'search'
                                ? <TextInput value={query} onChange={setQuery} onSubmit={() => setFocus('list')} />
                                : <Text color="gray">{query || t('link.tabToSearch')}</Text>
                            }
                        </Box>
                        <Text color="gray">{'─'.repeat(50)}</Text>

                        {pageApps.length > 0
                            ? pageApps.map((app, i) => (
                                <Box key={app.value} gap={1}>
                                    <Text color={i === safeCursor ? 'cyan' : 'gray'}>{i === safeCursor ? '›' : ' '}</Text>
                                    <Text color={i === safeCursor ? 'white' : 'gray'}>{app.label}</Text>
                                </Box>
                            ))
                            : <Text color="gray">{t('list.noResults')}</Text>
                        }
                        <Box height={1} />
                    </Box>
                )}

                {step === 'error' && (
                    <Box flexDirection="column" gap={1}>
                        <Text color="red">✗ {errorMsg}</Text>
                    </Box>
                )}
            </Box>

            <Text color="gray">{t('hint.link')}</Text>
        </Box>
    )
}
