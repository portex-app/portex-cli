import { Box, Text, useInput } from 'ink'
import Spinner from 'ink-spinner'
import TextInput from 'ink-text-input'
import React, { useEffect, useState } from 'react'

import { t } from '../../locales/index.js'
import { createApplication, fetchPlatforms } from '../../services/app.js'
import { writeProjectConfig } from '../../services/config.js'
import { useApp } from '../context/AppContext.js'
import { Header } from '../components/Header.js'

type Field = 'name' | 'description'
type Step = 'form' | 'platform' | 'creating' | 'done' | 'error'

export function NewAppScreen() {
    const { setScreen } = useApp()
    const [step, setStep] = useState<Step>('form')
    const [field, setField] = useState<Field>('name')
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const [platforms, setPlatforms] = useState<Array<{ label: string; value: string }>>([])
    const [platformIdx, setPlatformIdx] = useState(0)
    const [description, setDescription] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchPlatforms().then(list =>
            setPlatforms(list.map(p => ({ label: p.name, value: p.id })))
        )
    }, [])

    function validateName(n: string): boolean {
        if (/^[a-z0-9_]{5,35}$/.test(n)) { setNameError(''); return true }
        setNameError(t('new.appNameInvalid'))
        return false
    }

    function handleFormSubmit() {
        if (!validateName(name)) { setField('name'); return }
        setStep('platform')
    }

    async function handleCreate() {
        setStep('creating')
        try {
            const platformId = platforms[platformIdx].value
            const app = await createApplication({ name, platformId, description })
            writeProjectConfig({ appId: app.id, appName: name, deployPath: './dist', description })
            setMessage(t('new.configCreated'))
            setStep('done')
        } catch {
            setMessage(t('new.failed'))
            setStep('error')
        }
    }

    useInput((input, key) => {
        if (key.escape) {
            if (step === 'platform') { setStep('form'); return }
            setScreen(step === 'done' ? 'dashboard' : 'setup')
            return
        }
        if (step === 'form') {
            if (key.tab && key.shift) { setField(f => f === 'description' ? 'name' : 'description'); return }
            if (key.tab)              { setField(f => f === 'name' ? 'description' : 'name'); return }
            if (key.return && field === 'name')        { if (validateName(name)) setStep('platform'); return }
            if (key.return && field === 'description') { handleFormSubmit(); return }
        }
        if (step === 'platform') {
            if (key.upArrow)   { setPlatformIdx(i => (i - 1 + platforms.length) % platforms.length); return }
            if (key.downArrow) { setPlatformIdx(i => (i + 1) % platforms.length); return }
            if (key.return)    { handleCreate(); return }
        }
    })

    const hint = step === 'form'
        ? t('hint.newApp.form')
        : step === 'platform'
        ? t('hint.newApp.platform')
        : t('hint.newApp.done')

    return (
        <Box flexDirection="column" gap={1}>
            <Header />
            <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1} width={60}>
                <Text bold color="cyan">{t('new.title')}</Text>
                <Box height={1} />

                {/* ── Step 1: form ── */}
                {(step === 'form' || step === 'platform' || step === 'creating' || step === 'done' || step === 'error') && (
                    <>
                        <Box gap={1}>
                            <Text color={field === 'name' && step === 'form' ? 'cyan' : 'gray'}>{'>'}</Text>
                            <Text color="gray">{t('new.nameLabel')}: </Text>
                            {field === 'name' && step === 'form'
                                ? <TextInput
                                    value={name}
                                    onChange={v => { setName(v); setNameError('') }}
                                    onSubmit={() => {}}
                                  />
                                : <Text color={name ? 'white' : 'gray'}>{name || '─'}</Text>
                            }
                        </Box>
                        {nameError && <Text color="red">  {nameError}</Text>}

                        <Box gap={1} marginTop={1}>
                            <Text color={field === 'description' && step === 'form' ? 'cyan' : 'gray'}>{'>'}</Text>
                            <Text color="gray">{t('new.descriptionLabel')}: </Text>
                            {field === 'description' && step === 'form'
                                ? <TextInput
                                    value={description}
                                    onChange={setDescription}
                                    onSubmit={handleFormSubmit}
                                    placeholder={t('common.skip')}
                                  />
                                : description ? <Text color="white">{description}</Text> : null
                            }
                        </Box>
                    </>
                )}

                {/* ── Step 2: platform ── */}
                {step === 'platform' && (
                    <Box flexDirection="column" marginTop={1}>
                        <Text color="gray">{'─'.repeat(50)}</Text>
                        <Text color="gray">{t('new.platform')}:</Text>
                        {platforms.map((p, i) => (
                            <Box key={p.value} gap={1}>
                                <Text color={i === platformIdx ? 'cyan' : 'gray'}>{i === platformIdx ? '›' : ' '}</Text>
                                <Text color={i === platformIdx ? 'white' : 'gray'}>{p.label}</Text>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* ── Creating / Done / Error ── */}
                {step === 'creating' && (
                    <Box gap={1} marginTop={1}>
                        <Text color="cyan"><Spinner type="dots" /></Text>
                        <Text color="cyan">{t('new.creating')}</Text>
                    </Box>
                )}

                {step === 'done' && (
                    <Box flexDirection="column" marginTop={1} gap={1}>
                        <Text color="green">✓ {t('new.success')}</Text>
                        <Text color="green">✓ {message}</Text>
                        <Text color="gray">Tip: commit .portex/ to git for team sharing</Text>
                    </Box>
                )}

                {step === 'error' && (
                    <Box marginTop={1}>
                        <Text color="red">✗ {message}</Text>
                    </Box>
                )}
            </Box>

            <Text color="gray">{hint}</Text>
        </Box>
    )
}
