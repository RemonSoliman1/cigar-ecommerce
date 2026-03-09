'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext();

export function TelegramProvider({ children }) {
    const [webApp, setWebApp] = useState(null);
    const [user, setUser] = useState(null);
    const [isTelegram, setIsTelegram] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;

            // Validate if truly in Telegram (initData is present)
            if (tg.initData) {
                tg.ready();
                tg.expand(); // Auto-expand to full height

                setWebApp(tg);
                setIsTelegram(true);
                setUser(tg.initDataUnsafe?.user || null);

                // Set header color to match app
                tg.setHeaderColor('#0e0a08');
                tg.setBackgroundColor('#0e0a08');
            }
        }
    }, []);

    // Helper to control MainButton
    const setMainButton = (params) => {
        if (!webApp) return;
        const mainBtn = webApp.MainButton;

        if (params.text) mainBtn.setText(params.text);
        if (params.color) mainBtn.setParams({ color: params.color });
        if (params.textColor) mainBtn.setParams({ text_color: params.textColor });

        if (params.isVisible) mainBtn.show();
        else mainBtn.hide();

        if (params.isActive) mainBtn.enable();
        else mainBtn.disable();

        // Clear previous listeners to avoid duplicates
        mainBtn.offClick(mainBtn.onClickCallback);
        if (params.onClick) {
            mainBtn.onClickCallback = params.onClick;
            mainBtn.onClick(params.onClick);
        }
    };

    return (
        <TelegramContext.Provider value={{ webApp, user, isTelegram, setMainButton }}>
            {children}
        </TelegramContext.Provider>
    );
}

export function useTelegram() {
    return useContext(TelegramContext);
}
