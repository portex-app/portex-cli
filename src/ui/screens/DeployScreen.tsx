import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import TextInput from 'ink-text-input'
import React, { useState } from 'react'

import { t } from '../../locales/index.js'
import { deployApp } from '../../services/deploy.js'
import { readProjectConfig } from '../../services/config.js'
import { useApp } from '../context/AppContext.js'
import { Header } from '../components/Header.js'
import { ProgressBar } from '../components/ProgressBar.js'

type Step = 'appName' | 'path' | 'description' | 'deploying' | 'done' | 'error'

export function DeployScreen() {
    const { setScreen } = useApp()
    const cfg = readProjectConfig()

    const [step, setStep] = useState<Step>(cfg.appName ? 'path' : 'appName')
    const [appName, setAppName] = useState(cfg.appName ?? '')
    const [buildPath, setBuildPath] = useState(cfg.deployPath ?? './dist')
    const [description, setDescription] = useState('')
    const [stage, setStage] = useState('')
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState<{ version: number } | null>(null)
    const [errorMsg, setErrorMsg] = useState('')

    useInput((_, key) => {
        if (key.escape) setScreen('dashboard')
    })

    async function handleDeploy() {
        setStep('deploying')
        try {
            const res = await deployApp({
                appName,
                buildPath,
                description,
                onProgress: (s, pct) => {
                    setStage(s)
                    if (pct !== undefined) setProgress(pct)
                },
            })
            setResult(res)
            setStep('done')
        } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : t('common.unknownError'))
            setStep('error')
        }
    }

    const stageLabel: Record<string, string> = {
        compressing: t('deploy.compressing'),
        getting_url: t('deploy.gettingUrl'),
        uploading: t('deploy.uploading'),
    }

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={60}>
                <Text bold color="cyan">{t('deploy.title')}</Text>
                <Box height={1} />

                <Box gap={1}>
                    <Text color={step === 'appName' ? 'cyan' : 'gray'}>{'>'}</Text>
                    <Text>{t('deploy.appName')}: </Text>
                    {step === 'appName'
                        ? <TextInput value={appName} onChange={setAppName} onSubmit={() => appName && setStep('path')} focus />
                        : <Text color="green">{appName}</Text>
                    }
                </Box>

                {step !== 'appName' && (
                    <Box gap={1} marginTop={1}>
                        <Text color={step === 'path' ? 'cyan' : 'gray'}>{'>'}</Text>
                        <Text>{t('deploy.path')}: </Text>
                        {step === 'path'
                            ? <TextInput value={buildPath} onChange={setBuildPath} onSubmit={() => buildPath && setStep('description')} focus />
                            : <Text color="green">{buildPath}</Text>
                        }
                    </Box>
                )}

                {step === 'description' && (
                    <Box gap={1} marginTop={1}>
                        <Text color="cyan">{'>'}</Text>
                        <Text>{t('deploy.description')}: </Text>
                        <TextInput
                            value={description}
                            onChange={setDescription}
                            onSubmit={handleDeploy}
                            focus
                            placeholder={t('common.skip')}
                        />
                    </Box>
                )}

                {step === 'deploying' && (
                    <Box flexDirection="column" marginTop={1} gap={1}>
                        <Box gap={1}>
                            <Text color="cyan"><Spinner type="dots" /></Text>
                            <Text color="cyan">{stageLabel[stage] ?? stage}</Text>
                        </Box>
                        {stage === 'uploading' && <ProgressBar percent={progress} width={40} />}
                    </Box>
                )}

                {step === 'done' && result && (
                    <Box flexDirection="column" marginTop={1} gap={1}>
                        <Text color="green">✓ {t('deploy.success')}</Text>
                        <Text color="white">{t('deploy.version')}: <Text bold color="cyan">{result.version}</Text></Text>
                        <Text color="gray">{t('deploy.nextStep')}</Text>
                    </Box>
                )}

                {step === 'error' && (
                    <Box flexDirection="column" marginTop={1} gap={1}>
                        <Text color="red">✗ {t('deploy.failed')}</Text>
                        <Text color="red">{errorMsg}</Text>
                    </Box>
                )}
            </Box>

            <Text color="gray">{t('hint.deploy')}</Text>
        </Box>
    )
}
