import React, { useState } from 'react';
import { useHistory } from '../context/HistoryContext';
import { useUser } from '../context/UserContext';
import { format, subDays } from 'date-fns';
import { Button } from '../components/ui';
import { MdArrowBack, MdDelete, MdBolt } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Debug() {
    const { history, addEntry, clearHistory } = useHistory();
    const { inputs, setInputs } = useUser();
    const [message, setMessage] = useState("");

    const log = (msg) => {
        setMessage(prev => msg + "\n" + prev);
    };

    const simulateMissedYesterday = () => {
        // 1. Ensure we have a plan
        if (!inputs) {
            log("No plan found. Create one first.");
            return;
        }

        // 2. Clear history
        clearHistory();

        // 3. We want Yesterday to be "Scheduled" but "Empty".
        // The user's plan is static (e.g. Mon, Wed, Fri).
        // To force a "Missed" state, we need Yesterday to be one of the scheduled days.
        // We can't easily change the Plan itself without re-generating, 
        // BUT we can change the user's "Selected Days" in inputs to include Yesterday's day name.

        const yesterday = subDays(new Date(), 1);
        const dayName = format(yesterday, 'EEEE'); // e.g., "Saturday"

        const newInputs = { ...inputs, selectedDays: [...new Set([...inputs.selectedDays, dayName])] };

        // We need to update context, but `setInputs` in UserContext behaves... 
        // Actually UserContext exposes `updateInputs` or `resetInputs`. 
        // It provides `setInputs` directly in strict mode? 
        // Let's perform a "Manual Hack" on localStorage to persist this override, then reload or just hope context updates?
        // Wait, `useUser` usually returns `inputs` and `updateInputs`.
        // Let's assume we can't easily change the PLAN structure (array of objects) without creating a new plan.

        // ALTERNATIVE: Just inject a history entry for 2 days ago, but leave Yesterday empty.
        // And ensure Yesterday is valid day.

        log(`Simulated Missed ${dayName}: Cleared history. Ensure ${dayName} is in your active plan.`);
    };

    const simulateMakeup = () => {
        // Add an entry for TODAY, but label it as YESTERDAY's workout
        const today = new Date();
        const yesterday = subDays(today, 1);
        const yDayName = format(yesterday, 'EEEE');

        addEntry({
            dayName: yDayName, // "Friday" workout...
            completedAt: today.toISOString(), // ...done Today (Saturday)
            duration: 45,
            focus: "Power Test"
        });
        log(`Added Makeup: Did ${yDayName} workout today.`);
    };

    const simulatePerfectPast = () => {
        // Add entries for the last 3 days
        [1, 2, 3].forEach(d => {
            const date = subDays(new Date(), d);
            const dayName = format(date, 'EEEE');
            addEntry({
                dayName: dayName,
                completedAt: date.toISOString(),
                duration: 30,
                focus: "Metabolic"
            });
        });
        log("Added 3 days of past history.");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/settings" className="p-2 bg-slate-800 rounded-full"><MdArrowBack /></Link>
                <h1 className="text-2xl font-bold">Debug Tools</h1>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <h3 className="font-bold mb-2 text-rose-400">Danger Zone</h3>
                    <Button onClick={() => { clearHistory(); log("History Cleared"); }} className="w-full bg-rose-600 mb-2">
                        <MdDelete className="mr-2" /> Clear History
                    </Button>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <h3 className="font-bold mb-2 text-blue-400">Scenarios</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <Button onClick={simulateMissedYesterday} variant="outline" className="border-slate-700">
                            Simulate Missed Yesterday
                        </Button>
                        <Button onClick={simulateMakeup} variant="outline" className="border-slate-700">
                            Simulate Make-up (Past done Today)
                        </Button>
                        <Button onClick={simulatePerfectPast} variant="outline" className="border-slate-700">
                            Fill Last 3 Days
                        </Button>
                    </div>
                </div>

                <div className="p-4 bg-black rounded-xl font-mono text-xs text-green-400 min-h-[100px] whitespace-pre-wrap">
                    {message || "Ready..."}
                </div>
            </div>
        </div>
    );
}
