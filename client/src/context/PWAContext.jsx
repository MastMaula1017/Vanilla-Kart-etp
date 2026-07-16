import { createContext, useContext, useEffect, useState } from 'react';

const PWAContext = createContext();

export const PWAProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            console.log("PWA install prompt captured");
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    return (
        <PWAContext.Provider value={{ deferredPrompt, setDeferredPrompt }}>
            {children}
        </PWAContext.Provider>
    );
};

export const usePWA = () => {
    return useContext(PWAContext);
};
