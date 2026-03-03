import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import { useEffect, useState } from 'react';
import { t } from '../../locales/index.js';
import { getApplicationInfo } from '../../services/app.js';
import { publishApp, getVersionList } from '../../services/publish.js';
import { readProjectConfig } from '../../services/config.js';
import { useApp } from '../context/AppContext.js';
import { Header } from '../components/Header.js';
const ENV_ITEMS = [
    { label: t('publish.env.dev'), value: 'dev' },
    { label: t('publish.env.test'), value: 'test' },
    { label: t('publish.env.prod'), value: 'prod' },
];
export function PublishScreen() {
    const { setScreen } = useApp();
    const cfg = readProjectConfig();
    const [step, setStep] = useState('loading');
    const [appName] = useState(cfg.appName ?? '');
    const [appId, setAppId] = useState('');
    const [versions, setVersions] = useState([]);
    const [version, setVersion] = useState(0);
    const [env, setEnv] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        if (!appName) {
            setErrorMsg(t('config.notFound'));
            setStep('error');
            return;
        }
        getApplicationInfo({ application_name: appName })
            .then(app => {
            setAppId(app.id);
            return getVersionList(app.id);
        })
            .then(list => {
            if (!list.length) {
                setErrorMsg(t('publish.noVersions'));
                setStep('error');
                return;
            }
            setVersions(list.map(v => ({ label: `v${v.version}`, value: v.version })).reverse());
            setStep('selectVersion');
        })
            .catch(() => { setErrorMsg(t('common.networkError')); setStep('error'); });
    }, [appName]);
    useInput((_, key) => {
        if (key.escape)
            setScreen('dashboard');
    });
    function handleVersionSelect(item) {
        setVersion(item.value);
        setStep('selectEnv');
    }
    async function handleEnvSelect(item) {
        setEnv(item.value);
        setStep('publishing');
        try {
            const url = await publishApp({ applicationId: appId, appName, version, env: item.value });
            setPreviewUrl(url);
            setStep('done');
        }
        catch {
            setErrorMsg(t('publish.failed'));
            setStep('error');
        }
    }
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsx(Header, {}), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, width: 60, children: [_jsx(Text, { bold: true, color: "cyan", children: t('publish.title') }), appName && _jsxs(Text, { color: "gray", children: ["App: ", _jsx(Text, { color: "white", children: appName })] }), _jsx(Box, { height: 1 }), step === 'loading' && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { children: t('common.loading') })] })), step === 'selectVersion' && (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { children: [t('publish.selectVersion'), ":"] }), _jsx(SelectInput, { items: versions, onSelect: handleVersionSelect, limit: 8 })] })), step === 'selectEnv' && (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { color: "gray", children: ["Version: ", _jsxs(Text, { color: "green", children: ["v", version] })] }), _jsx(Box, { height: 1 }), _jsxs(Text, { children: [t('publish.selectEnv'), ":"] }), _jsx(SelectInput, { items: ENV_ITEMS, onSelect: handleEnvSelect })] })), step === 'publishing' && (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyan", children: _jsx(Spinner, { type: "dots" }) }), _jsx(Text, { color: "cyan", children: t('publish.publishing') })] })), step === 'done' && (_jsxs(Box, { flexDirection: "column", gap: 1, children: [_jsxs(Text, { color: "green", children: ["\u2713 ", t('publish.success')] }), _jsxs(Text, { color: "gray", children: ["v", version, " \u2192 ", _jsx(Text, { color: "white", children: env })] }), _jsxs(Text, { color: "cyan", children: [t('publish.previewUrl'), ": ", previewUrl] })] })), step === 'error' && (_jsx(Box, { flexDirection: "column", gap: 1, children: _jsxs(Text, { color: "red", children: ["\u2717 ", errorMsg] }) }))] }), _jsx(Text, { color: "gray", children: t('hint.publish') })] }));
}
