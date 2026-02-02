import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SystemChart({ history }) {
    // Process history to count systems
    const dataMap = {
        'Power': 0,
        'Metabolic': 0, // Maps to 'Burn' usually
        'Endurance': 0
    };

    history.forEach(entry => {
        const type = String(entry.focus || entry.type || "").toLowerCase();
        if (type.includes('power') || type.includes('phosphagen')) {
            dataMap['Power']++;
        } else if (type.includes('metabolic') || type.includes('burn') || type.includes('glycolytic')) {
            dataMap['Metabolic']++;
        } else if (type.includes('endurance') || type.includes('oxidative')) {
            dataMap['Endurance']++;
        }
    });

    const data = [
        { name: 'Power', count: dataMap['Power'], color: '#fbbf24' }, // amber-400
        { name: 'Burn', count: dataMap['Metabolic'], color: '#f97316' }, // orange-500
        { name: 'Endurance', count: dataMap['Endurance'], color: '#22c55e' }, // green-500
    ];

    if (history.length === 0) return null;

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">System Balance</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                                borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a'
                            }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
