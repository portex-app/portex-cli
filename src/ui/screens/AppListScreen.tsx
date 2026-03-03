import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import TextInput from 'ink-text-input'
import { useEffect, useMemo, useState } from 'react'

import { t } from '../../locales/index.js'
import { listApplications } from '../../services/app.js'
import { readProjectConfig } from '../../services/config.js'
import { useApp } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

const PAGE_SIZE = 8
const col = (s: string, w: number) => s.substring(0, w).padEnd(w)

export function AppListScreen() {
    const { setScreen } = useApp()
    const [allApps, setAllApps] = useState<Application[]>([])
    const [platforms, setPlatforms] = useState<string[]>(['All'])
    const [platformIdx, setPlatformIdx] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(0)
    const [searching, setSearching] = useState(false)

    useEffect(() => {
        listApplications()
            .then(list => {
                setAllApps(list)
                const unique = Array.from(new Set(list.map(a => a.platform_name))).sort()
                setPlatforms(['All', ...unique])
                setLoading(false)
            })
            .catch(() => { setError(t('common.networkError')); setLoading(false) })
    }, [])

    const filtered = useMemo(() => {
        const platform = platforms[platformIdx]
        let result = platform !== 'All' ? allApps.filter(a => a.platform_name === platform) : allApps
        if (query.trim()) {
            const q = query.toLowerCase()
            result = result.filter(a => a.name.toLowerCase().includes(q))
        }
        return result
    }, [allApps, platforms, platformIdx, query])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages - 1)
    const pageApps = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

    useEffect(() => { setPage(0) }, [query, platformIdx])

    const backScreen = readProjectConfig().appName ? 'dashboard' : 'setup'
    const currentPlatform = platforms[platformIdx] ?? 'All'

    useInput((input, key) => {
        if (key.escape) {
            if (searching) { setSearching(false); return }
            setScreen(backScreen)
            return
        }
        if (key.tab) { setSearching(s => !s); return }
        if (searching) return
        if (key.leftArrow)  setPage(p => Math.max(0, p - 1))
        if (key.rightArrow) setPage(p => Math.min(totalPages - 1, p + 1))
        if (input === 'p') { setPlatformIdx(i => (i + 1) % platforms.length); return }
        if (input && input.length === 1 && /\S/.test(input)) {
            setQuery(q => q + input)
            setSearching(true)
        }
    })

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1}>

                <Box justifyContent="space-between">
                    <Text bold color="cyan">{t('list.title')}</Text>
                    <Box gap={2}>
                        {!loading && !error && (
                            <Text color="gray">{safePage + 1} / {totalPages}  ({filtered.length})</Text>
                        )}
                        <Box gap={1}>
                            <Text color="gray">platform:</Text>
                            <Text color={currentPlatform === 'All' ? 'gray' : 'cyan'}>{currentPlatform}</Text>
                        </Box>
                    </Box>
                </Box>

                <Box marginTop={1} gap={1}>
                    <Text color={searching ? 'cyan' : 'gray'}>⌕</Text>
                    {searching
                        ? <TextInput value={query} onChange={setQuery} onSubmit={() => setSearching(false)} />
                        : <Text color="gray">{query || t('link.tabToSearch')}</Text>
                    }
                </Box>

                <Box height={1} />

                {loading && (
                    <Box gap={1}>
                        <Text color="cyan"><Spinner type="dots" /></Text>
                        <Text>{t('list.loading')}</Text>
                    </Box>
                )}

                {error && <Text color="red">✗ {error}</Text>}

                {!loading && !error && allApps.length === 0 && (
                    <Text color="gray">{t('list.empty')}</Text>
                )}

                {!loading && !error && allApps.length > 0 && filtered.length === 0 && (
                    <Text color="gray">{t('list.noResults')}</Text>
                )}

                {!loading && pageApps.length > 0 && (
                    <Box flexDirection="column">
                        <Text bold color="gray">
                            {col(t('list.headers.name'), 18)}
                            {col(t('list.headers.platform'), 12)}
                            {col(t('list.headers.lastVersion'), 8)}
                            {'  '}
                            {col(t('list.headers.dev'), 5)}
                            {col(t('list.headers.test'), 5)}
                            {col(t('list.headers.prod'), 5)}
                        </Text>
                        <Text color="gray">{'─'.repeat(58)}</Text>
                        {pageApps.map(app => {
                            const vmap: Record<string, string> = {}
                            for (const v of app.published_versions ?? []) vmap[String(v.env)] = String(v.version)
                            return (
                                <Box key={app.id}>
                                    <Text>
                                        {col(app.name, 18)}
                                        <Text color="gray">{col(app.platform_name, 12)}</Text>
                                        <Text color="cyan">{col(String(app.last_version), 8)}</Text>
                                        {'  '}
                                        <Text color={vmap['0'] ? 'green' : 'gray'}>{col(vmap['0'] ?? '-', 5)}</Text>
                                        <Text color={vmap['1'] ? 'yellow' : 'gray'}>{col(vmap['1'] ?? '-', 5)}</Text>
                                        <Text color={vmap['2'] ? 'red' : 'gray'}>{col(vmap['2'] ?? '-', 5)}</Text>
                                    </Text>
                                </Box>
                            )
                        })}
                    </Box>
                )}

            </Box>

            <Text color="gray">{t('hint.appList')}</Text>
        </Box>
    )
}
