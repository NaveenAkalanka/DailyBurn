import React, { createContext, useContext, useMemo, useState } from "react";
import { generatePlan } from "../logic/generator";

const UserContext = createContext();

export function UserProvider({ children }) {
    // 1. Inputs State (User Preferences)
    const [inputs, setInputs] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dailyburn_inputs');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Migration: Ensure startDate exists
                    if (!parsed.startDate) {
                        let earliest = new Date();
                        const historyJson = localStorage.getItem('dailyburn_history');
                        if (historyJson) {
                            try {
                                const hist = JSON.parse(historyJson);
                                if (hist.length > 0) {
                                    // Find oldest entry
                                    const oldest = hist.reduce((min, p) => p.completedAt < min ? p.completedAt : min, hist[0].completedAt);
                                    earliest = new Date(oldest);
                                }
                            } catch (e) { }
                        }
                        parsed.startDate = earliest.toISOString();
                        localStorage.setItem('dailyburn_inputs', JSON.stringify(parsed));
                    }
                    return parsed;
                } catch (e) {
                    console.error("Failed to parse saved user inputs", e);
                }
            }
        }
        return null;
    });

    // 2. Current Plan State (The S.O.T. - Source of Truth)
    // Now persisted directly to storage, not regenerated on fly
    const [currentPlan, setCurrentPlan] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedPlan = localStorage.getItem('dailyburn_plan');
            if (savedPlan) {
                try {
                    return JSON.parse(savedPlan);
                } catch (e) {
                    console.error("Failed to parse saved plan", e);
                }
            }

            // Migration/Fallback: If no plan but inputs exist (legacy user), generate one now
            const savedInputs = localStorage.getItem('dailyburn_inputs');
            if (savedInputs) {
                try {
                    const parsedInputs = JSON.parse(savedInputs);
                    const newPlan = generatePlan(parsedInputs);
                    // Save it immediately so it sticks
                    localStorage.setItem('dailyburn_plan', JSON.stringify(newPlan));
                    return newPlan;
                } catch (e) { }
            }
        }
        return [];
    });

    // Updates inputs AND generates a FRESH plan (used by Onboarding/Settings)
    // This is the "Reset/Regenerate" Action
    const updateInputs = (newInputs) => {
        // Ensure startDate is set. If we are resetting (newInputs), likely want new start date OR preserve old?
        // Usually 'updateInputs' implies a fresh start or re-config.
        // Let's preserve it if it exists in newInputs, else default to NOW.
        // But if user just changes equipment, we shouldn't reset start date?
        // Check if we are merging or replacing. The app usage suggests replace during onboarding.
        // To be safe: use existing startDate if not provided, else new Date.
        const mergedInputs = {
            startDate: inputs?.startDate || new Date().toISOString(),
            ...newInputs
        };

        setInputs(mergedInputs);
        localStorage.setItem('dailyburn_inputs', JSON.stringify(mergedInputs));

        // Generate Fresh Plan
        const newPlan = generatePlan(mergedInputs);
        setCurrentPlan(newPlan);
        localStorage.setItem('dailyburn_plan', JSON.stringify(newPlan));
    };

    // Modify the existing plan in-place (Swap)
    const swapExercise = (dayName, blockIdx, oldExName, newEx) => {
        setCurrentPlan(prevPlan => {
            const nextPlan = prevPlan.map(day => {
                if (day.day !== dayName) return day;

                // Found the day, map the blocks
                const newBlocks = day.rawBlocks.map((block, bIdx) => {
                    if (bIdx !== blockIdx) return block;

                    // Found the block, map the exercises
                    const newExercises = block.exercises.map(ex => {
                        // Strict check on name to find the slot
                        if (ex.name === oldExName) {
                            // Merge new exercise details
                            return {
                                ...newEx,
                                target: ex.target || "10-12 reps",
                                is_challenge: ex.is_challenge // Preserve boss status if any
                            };
                        }
                        return ex;
                    });

                    return { ...block, exercises: newExercises };
                });

                return { ...day, rawBlocks: newBlocks };
            });

            // Persist Update
            localStorage.setItem('dailyburn_plan', JSON.stringify(nextPlan));
            return nextPlan;
        });
    };

    const resetInputs = () => {
        setInputs(null);
        setCurrentPlan([]);
        localStorage.removeItem('dailyburn_inputs');
        localStorage.removeItem('dailyburn_plan');
        localStorage.removeItem('dailyburn_swaps'); // Clean up legacy
    };

    return (
        <UserContext.Provider value={{
            inputs,
            currentPlan,
            updateInputs,
            swapExercise,
            resetInputs
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
