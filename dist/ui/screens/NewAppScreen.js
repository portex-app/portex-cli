import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import { useEffect, useState } from 'react';
import { t } from '../../locales/index.js';
import { createApplication, fetchPlatforms } from '../../services/app.js';
import { writeProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
export function NewAppScreen() {
    const { setScreen } = useApp();
    const [step, setStep] = useState('form');
    const [field, setField] = useState('name');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [platforms, setPlatforms] = useState([]);
    const [platformIdx, setPlatformIdx] = useState(0);
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    useEffect(() => {
        fetchPlatforms().then(list => setPlatforms(list.map(p => ({ label: p.name, value: p.id }))));
    }, []);
    function validateName(n) {
        if (/^[a-z0-9_]{5,35}$/.test(n)) {
            setNameError('');
            return true;
        }
        setNameError(t('new.appNameInvalid'));
        return false;
    }
    function handleFormSubmit() {
        if (!validateName(name)) {
            setField('name');
            return;
        }
        setStep('platform');
    }
    async function handleCreate() {
        setStep('creating');
        try {
            const platformId = platforms[platformIdx].value;
            const app = await createApplication({ name, platformId, description });
            writeProjectConfig({ appId: app.id, appName: name, deployPath: './dist', description });
            setMessage(t('new.configCreated'));
            setStep('done');
        }
        catch {
            setMessage(t('new.failed'));
            setStep('error');
        }
    }
    useInput((input, key) => {
        if (key.escape) {
            if (step === 'platform') {
                setStep('form');
                return;
            }
            setScreen(step === 'done' ? 'dashboard' : 'setup');
            return;
        }
        if (step === 'form') {
            if (key.tab && key.shift) {
                setField(f => f === 'description' ? 'name' : 'description');
                return;
            }
            if (key.tab) {
                setField(f => f === 'name' ? 'description' : 'name');
                return;
            }
            if (key.return && field === 'name') {
                if (validateName(name))
                    setStep('platform');
                return;
            }
            if (key.return && field === 'description') {
                handleFormSubmit();
                return;
            }
        }
        if (step === 'platform') {
            if (key.upArrow) {
                setPlatformIdx(i => (i - 1 + platforms.length) % platforms.length);
                return;
            }
            if (key.downArrow) {
                setPlatformIdx(i => (i + 1) % platforms.length);
                return;
            }
            if (key.return) {
                handleCreate();
                return;
            }
        }
    });
    const hint = step === 'form'
        ? t('hint.newApp.form')
        : step === 'platform'
            ? t('hint.newApp.platform')
            : t('hint.newApp.done');
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 60, children: [_jsx(Text, { bold: true, color: "cyan", children: t('new.title') }), _jsx(Box, { height: 1 }), (step === 'form' || step === 'platform' || step === 'creating' || step === 'done' || step === 'error') && (_jsxs(_Fragment, { children: [_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: field === 'name' && step === 'form' ? 'cyan' : 'gray', children: '>' }), _jsxs(Text, { color: "gray", children: [t('new.nameLabel'), ": "] }), field === 'name' && step === 'form'
                                        ? _jsx(TextInput, { value: name, onChange: v => { setName(v); setNameError(''); }, onSubmit: () => { } })
                                        : _jsx(Text, { color: name ? 'white' : 'gray', children: name || '─' })] }), nameError && _jsxs(Text, { color: "red", children: ["  ", nameError] }), _jsxs(Box, { gap: 1, marginTop: 1, children: [_jsx(Text, { color: field === 'description' && step === 'form' ? 'cyan' : 'gray', children: '>' }), _jsxs(Text, { color: "gray", children: [t('new.descriptionLabel'), ": "] }), field === 'description' && step === 'form'
                                        ? _jsx(TextInput, { value: description, onChange: setDescription, onSubmit: handleFormSubmit, placeholder: t('common.skip') })
                                        : description ? _jsx(Text, { color: "white", children: description }) : null] })] })), step === 'platform' && (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { color: "gray", children: '─'.repeat(50) }), _jsxs(Text, { color: "gray", children: [t('new.platform'), ":"] }), platforms.map((p, i) => (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: i === platformIdx ? 'cyan' : 'gray', children: i === platformIdx ? '›' : ' ' }), _jsx(Text, { color: i === platformIdx ? 'white' : 'gray', children: p.label })] }, p.value)))] })), step === 'creating' && (_jsxs(Box, { gap: 1, marginTop: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { color: "cyan", children: t('new.creating') })] })), step === 'done' && (_jsxs(Box, { flexDirection: "column", marginTop: 1, gap: 1, children: [_jsxs(Text, { color: "green", children: ["\u2713 ", t('new.success')] }), _jsxs(Text, { color: "green", children: ["\u2713 ", message] }), _jsx(Text, { color: "gray", children: "Tip: commit .portex/ to git for team sharing" })] })), step === 'error' && (_jsx(Box, { marginTop: 1, children: _jsxs(Text, { color: "red", children: ["\u2717 ", message] }) }))] }), _jsx(Text, { color: "gray", children: hint })] }));
}
