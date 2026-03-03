import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import { useState } from 'react';
import { t } from '../../locales/index.js';
import { deployApp } from '../../services/deploy.js';
import { readProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
import { ProgressBar } from '../components/ProgressBar.js';
export function DeployScreen() {
    const { setScreen } = useApp();
    const cfg = readProjectConfig();
    const [step, setStep] = useState(cfg.appName ? 'path' : 'appName');
    const [appName, setAppName] = useState(cfg.appName ?? '');
    const [buildPath, setBuildPath] = useState(cfg.deployPath ?? './dist');
    const [description, setDescription] = useState('');
    const [stage, setStage] = useState('');
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    useInput((_, key) => {
        if (key.escape)
            setScreen('dashboard');
    });
    async function handleDeploy() {
        setStep('deploying');
        try {
            const res = await deployApp({
                appName,
                buildPath,
                description,
                onProgress: (s, pct) => {
                    setStage(s);
                    if (pct !== undefined)
                        setProgress(pct);
                },
            });
            setResult(res);
            setStep('done');
        }
        catch (e) {
            setErrorMsg(e instanceof Error ? e.message : t('common.unknownError'));
            setStep('error');
        }
    }
    const stageLabel = {
        compressing: t('deploy.compressing'),
        getting_url: t('deploy.gettingUrl'),
        uploading: t('deploy.uploading'),
    };
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 60, children: [_jsx(Text, { bold: true, color: "cyan", children: t('deploy.title') }), _jsx(Box, { height: 1 }), _jsxs(Box, { gap: 1, children: [_jsx(Text, { color: step === 'appName' ? 'cyan' : 'gray', children: '>' }), _jsxs(Text, { children: [t('deploy.appName'), ": "] }), step === 'appName'
                                ? _jsx(TextInput, { value: appName, onChange: setAppName, onSubmit: () => appName && setStep('path'), focus: true })
                                : _jsx(Text, { color: "green", children: appName })] }), step !== 'appName' && (_jsxs(Box, { gap: 1, marginTop: 1, children: [_jsx(Text, { color: step === 'path' ? 'cyan' : 'gray', children: '>' }), _jsxs(Text, { children: [t('deploy.path'), ": "] }), step === 'path'
                                ? _jsx(TextInput, { value: buildPath, onChange: setBuildPath, onSubmit: () => buildPath && setStep('description'), focus: true })
                                : _jsx(Text, { color: "green", children: buildPath })] })), step === 'description' && (_jsxs(Box, { gap: 1, marginTop: 1, children: [_jsx(Text, { color: "cyan", children: '>' }), _jsxs(Text, { children: [t('deploy.description'), ": "] }), _jsx(TextInput, { value: description, onChange: setDescription, onSubmit: handleDeploy, focus: true, placeholder: t('common.skip') })] })), step === 'deploying' && (_jsxs(Box, { flexDirection: "column", marginTop: 1, gap: 1, children: [_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { color: "cyan", children: stageLabel[stage] ?? stage })] }), stage === 'uploading' && _jsx(ProgressBar, { percent: progress, width: 40 })] })), step === 'done' && result && (_jsxs(Box, { flexDirection: "column", marginTop: 1, gap: 1, children: [_jsxs(Text, { color: "green", children: ["\u2713 ", t('deploy.success')] }), _jsxs(Text, { color: "white", children: [t('deploy.version'), ": ", _jsx(Text, { bold: true, color: "cyan", children: result.version })] }), _jsx(Text, { color: "gray", children: t('deploy.nextStep') })] })), step === 'error' && (_jsxs(Box, { flexDirection: "column", marginTop: 1, gap: 1, children: [_jsxs(Text, { color: "red", children: ["\u2717 ", t('deploy.failed')] }), _jsx(Text, { color: "red", children: errorMsg })] }))] }), _jsx(Text, { color: "gray", children: t('hint.deploy') })] }));
}
