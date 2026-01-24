import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme] = useState('light'); // Always light

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
    }, []);

    const toggleTheme = () => {
        // No-op: Theme is locked to light
        console.log("Theme is locked to light mode.");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
