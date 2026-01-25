import React, { createContext, useContext, useState } from "react";

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
    // History Structure: Array of { id, date, dayName, duration, completedAt }
    const [history, setHistory] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dailyburn_history');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse history", e);
                }
            }
        }
        return [];
    });

    const addEntry = (session) => {
        const entry = {
            id: crypto.randomUUID(),
            completedAt: new Date().toISOString(),
            ...session
        };
        const newHistory = [entry, ...history];
        setHistory(newHistory);
        localStorage.setItem('dailyburn_history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('dailyburn_history');
    };

    const getStats = () => {
        const totalWorkouts = history.length;
        // Simple streak logic (consecutive days) could be added here
        return { totalWorkouts };
    };

    return (
        <HistoryContext.Provider value={{
            history,
            addEntry,
            clearHistory,
            getStats
        }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    return useContext(HistoryContext);
}
