import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import SelectInput from 'ink-select-input'
import React, { useEffect, useState } from 'react'

import { t } from '../../locales/index.js'
import { getApplicationInfo } from '../../services/app.js'
import { publishApp, getVersionList } from '../../services/publish.js'
import { readProjectConfig } from '../../services/config.js'
import { useApp } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

type Step = 'loading' | 'selectVersion' | 'selectEnv' | 'publishing' | 'done' | 'error'

const ENV_ITEMS = [
    { label: t('publish.env.dev'),  value: 'dev'  },
    { label: t('publish.env.test'), value: 'test' },
    { label: t('publish.env.prod'), value: 'prod' },
]

export function PublishScreen() {
    const { setScreen } = useApp()
    const cfg = readProjectConfig()

    const [step, setStep] = useState<Step>('loading')
    const [appName] = useState(cfg.appName ?? '')
    const [appId, setAppId] = useState('')
    const [versions, setVersions] = useState<Array<{ label: string; value: number }>>([])
    const [version, setVersion] = useState(0)
    const [env, setEnv] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (!appName) { setErrorMsg(t('config.notFound')); setStep('error'); return }
        getApplicationInfo({ application_name: appName })
            .then(app => {
                setAppId(app.id)
                return getVersionList(app.id)
            })
            .then(list => {
                if (!list.length) { setErrorMsg(t('publish.noVersions')); setStep('error'); return }
                setVersions(list.map(v => ({ label: `v${v.version}`, value: v.version })).reverse())
                setStep('selectVersion')
            })
            .catch(() => { setErrorMsg(t('common.networkError')); setStep('error') })
    }, [appName])

    useInput((_, key) => {
        if (key.escape) setScreen('dashboard')
    })

    function handleVersionSelect(item: { label: string; value: number }) {
        setVersion(item.value)
        setStep('selectEnv')
    }

    async function handleEnvSelect(item: { label: string; value: string }) {
        setEnv(item.value)
        setStep('publishing')
        try {
            const url = await publishApp({ applicationId: appId, appName, version, env: item.value })
            setPreviewUrl(url)
            setStep('done')
        } catch {
            setErrorMsg(t('publish.failed'))
            setStep('error')
        }
    }

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={60}>
                <Text bold color="cyan">{t('publish.title')}</Text>
                {appName && <Text color="gray">App: <Text color="white">{appName}</Text></Text>}
                <Box height={1} />

                {step === 'loading' && (
                    <Box gap={1}>
                        <Text color="cyan"><Spinner type="dots" /></Text>
                        <Text>{t('common.loading')}</Text>
                    </Box>
                )}

                {step === 'selectVersion' && (
                    <Box flexDirection="column">
                        <Text>{t('publish.selectVersion')}:</Text>
                        <SelectInput items={versions} onSelect={handleVersionSelect} limit={8} />
                    </Box>
                )}

                {step === 'selectEnv' && (
                    <Box flexDirection="column">
                        <Text color="gray">Version: <Text color="green">v{version}</Text></Text>
                        <Box height={1} />
                        <Text>{t('publish.selectEnv')}:</Text>
                        <SelectInput items={ENV_ITEMS} onSelect={handleEnvSelect} />
                    </Box>
                )}

                {step === 'publishing' && (
                    <Box gap={1}>
                        <Text color="cyan"><Spinner type="dots" /></Text>
                        <Text color="cyan">{t('publish.publishing')}</Text>
                    </Box>
                )}

                {step === 'done' && (
                    <Box flexDirection="column" gap={1}>
                        <Text color="green">✓ {t('publish.success')}</Text>
                        <Text color="gray">v{version} → <Text color="white">{env}</Text></Text>
                        <Text color="cyan">{t('publish.previewUrl')}: {previewUrl}</Text>
                    </Box>
                )}

                {step === 'error' && (
                    <Box flexDirection="column" gap={1}>
                        <Text color="red">✗ {errorMsg}</Text>
                    </Box>
                )}
            </Box>

            <Text color="gray">{t('hint.publish')}</Text>
        </Box>
    )
}
