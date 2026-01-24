import React, { createContext, useContext, useMemo, useState } from "react";
import { generatePlan } from "../logic/generator";

const UserContext = createContext();

export function UserProvider({ children }) {
    // Initialize from localStorage or default to null
    const [inputs, setInputs] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dailyburn_inputs');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse saved user inputs", e);
                }
            }
        }
        return null;
    });

    const currentPlan = useMemo(() => {
        if (!inputs) return [];
        return generatePlan(inputs);
    }, [inputs]);

    const updateInputs = (newInputs) => {
        setInputs(newInputs);
        localStorage.setItem('dailyburn_inputs', JSON.stringify(newInputs));
    };

    const resetInputs = () => {
        setInputs(null);
        localStorage.removeItem('dailyburn_inputs');
    };

    return (
        <UserContext.Provider value={{
            inputs,
            currentPlan,
            updateInputs,
            resetInputs
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
