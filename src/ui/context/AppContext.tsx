import React, { createContext, useContext, useState } from 'react'
import { type Locale, getLocale, setLocale } from '../../locales/index.js'

export type Screen =
    | 'login'
    | 'setup'       // 无 .portex，引导页
    | 'dashboard'   // 项目控制中心（有 .portex）
    | 'deploy'
    | 'publish'
    | 'appList'
    | 'newApp'
    | 'link'
    | 'bot'

interface AppContextValue {
    screen: Screen
    setScreen: (s: Screen) => void
    isLoggedIn: boolean
    setLoggedIn: (v: boolean) => void
    lang: Locale
    setLang: (l: Locale) => void
    toggleLang: () => void
}

const AppContext = createContext<AppContextValue>({
    screen: 'login',
    setScreen: () => {},
    isLoggedIn: false,
    setLoggedIn: () => {},
    lang: 'en',
    setLang: () => {},
    toggleLang: () => {},
})

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [screen, setScreen] = useState<Screen>('login')
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [lang, setLangState] = useState<Locale>(getLocale())

    function setLang(l: Locale) {
        setLocale(l)
        setLangState(l)
    }

    function toggleLang() {
        setLang(lang === 'zh' ? 'en' : 'zh')
    }

    return (
        <AppContext.Provider value={{ screen, setScreen, isLoggedIn, setLoggedIn, lang, setLang, toggleLang }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext)
}
