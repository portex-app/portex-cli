import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { getLocale, setLocale } from '../../locales/index.js';
const AppContext = createContext({
    screen: 'login',
    setScreen: () => { },
    isLoggedIn: false,
    setLoggedIn: () => { },
    lang: 'en',
    setLang: () => { },
    toggleLang: () => { },
});
export function AppProvider({ children }) {
    const [screen, setScreen] = useState('login');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [lang, setLangState] = useState(getLocale());
    function setLang(l) {
        setLocale(l);
        setLangState(l);
    }
    function toggleLang() {
        setLang(lang === 'zh' ? 'en' : 'zh');
    }
    return (_jsx(AppContext.Provider, { value: { screen, setScreen, isLoggedIn, setLoggedIn, lang, setLang, toggleLang }, children: children }));
}
export function useApp() {
    return useContext(AppContext);
}
