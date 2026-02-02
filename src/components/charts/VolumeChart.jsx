import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subDays } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
                <p className="text-slate-500 dark:text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">{label}</p>
                <p className="text-slate-900 dark:text-white font-black text-lg">
                    {payload[0].value} <span className="text-xs font-normal text-slate-400">min</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function VolumeChart({ history }) {
    // 1. Process Data: Get last 7 days (or 14) to show trend
    // If history is empty, show empty state or zeros
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    const data = last7Days.map(day => {
        // Find all entries for this day
        const dayEntries = history.filter(entry => isSameDay(parseISO(entry.completedAt), day));
        const totalMinutes = dayEntries.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);

        return {
            date: format(day, 'EEE'), // Mon, Tue
            fullDate: format(day, 'MMM d'),
            minutes: totalMinutes
        };
    });

    const totalVolume = data.reduce((acc, curr) => acc + curr.minutes, 0);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm min-w-0">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume</h3>
                    <p className="text-xs text-slate-500 font-medium">Last 7 Days</p>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalVolume}m</span>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total</span>
                </div>
            </div>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0'} strokeOpacity={0.5} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="minutes"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorMinutes)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
