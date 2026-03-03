import React from 'react';
import { type Locale } from '../../locales/index.js';
export type Screen = 'login' | 'setup' | 'dashboard' | 'deploy' | 'publish' | 'appList' | 'newApp' | 'link' | 'bot';
interface AppContextValue {
    screen: Screen;
    setScreen: (s: Screen) => void;
    isLoggedIn: boolean;
    setLoggedIn: (v: boolean) => void;
    lang: Locale;
    setLang: (l: Locale) => void;
    toggleLang: () => void;
}
export declare function AppProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useApp(): AppContextValue;
export {};
