import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function RadarProfile({ history }) {
    // Count stats
    const stats = {
        Power: 0,
        Metabolic: 0,
        Endurance: 0
    };

    history.forEach(entry => {
        // focus might be "Power", "Hypertrophy", "Endurance", "Metabolic"
        // normalize keys
        const focus = String(entry.focus || entry.type || "");

        if (focus.includes("Power") || focus.includes("Phosphagen")) stats.Power++;
        else if (focus.includes("Metabolic") || focus.includes("Glycolytic") || focus.includes("Burn")) stats.Metabolic++;
        else if (focus.includes("Endurance") || focus.includes("Oxidative")) stats.Endurance++;
        else {
            // Distribute general workouts? Or count as Balanced?
            // For now, let's map "Strength" to Power as well for simplicity in 3-axis
            if (focus.includes("Strength")) stats.Power++;
        }
    });

    // If no data, show a balanced default ghost
    const hasData = history.length > 0;
    const data = [
        { subject: 'Power', A: hasData ? stats.Power : 4, fullMark: 10 },
        { subject: 'Burn', A: hasData ? stats.Metabolic : 4, fullMark: 10 },
        { subject: 'Endurance', A: hasData ? stats.Endurance : 4, fullMark: 10 },
    ];

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden min-w-0">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-24 bg-rose-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

            <div className="relative z-10 mb-2 text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Athlete Profile</h3>
                <p className="text-xs text-slate-500 font-medium">System Balance</p>
            </div>

            <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke={document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'} strokeOpacity={0.5} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar
                            name="You"
                            dataKey="A"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            fill="#f43f5e"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                                color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a', fontWeight: 'bold' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {!hasData && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
                        <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">
                            Complete workouts to unlock
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
