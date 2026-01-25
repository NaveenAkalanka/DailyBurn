import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Dumbbell, BarChart, Settings as SettingsIcon } from 'lucide-react';

export default function BottomNav() {
    const navItems = [
        { to: '/exercises', icon: Dumbbell, label: 'Library' },
        { to: '/weekly-plan', icon: Calendar, label: 'Schedule' },
        { to: '/', icon: Home, label: 'Daily Plan', isCenter: true },
        { to: '/report', icon: BarChart, label: 'Report' },
        { to: '/settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-between items-center h-16 max-w-lg mx-auto px-2">
                {navItems.map(({ to, icon: Icon, label, isCenter }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `
              relative flex flex-col items-center justify-center transition-all duration-300
              ${isCenter
                                ? 'w-14 h-14 -mt-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40 text-white hover:bg-blue-700 hover:scale-105'
                                : `w-14 h-full space-y-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200'}`
                            }
            `}
                    >
                        <Icon className={isCenter ? "w-6 h-6" : "w-5 h-5"} strokeWidth={isCenter ? 2.5 : 2} />
                        {!isCenter && <span className="text-[9px] font-bold tracking-wide">{label}</span>}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
