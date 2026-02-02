import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdHome, MdCalendarToday, MdFitnessCenter, MdInsights, MdSettings } from 'react-icons/md';

export default function BottomNav() {

    const DailyBurnIcon = ({ className }) => (
        <img
            src="/DailyBurn.svg"
            alt="DailyBurn"
            className={`${className} brightness-0 invert`}
        />
    );

    const navItems = [
        { to: '/exercises', icon: MdFitnessCenter, label: 'Library' },
        { to: '/weekly-plan', icon: MdCalendarToday, label: 'Schedule' },
        { to: '/', icon: DailyBurnIcon, label: 'Daily Plan', isCenter: true },
        { to: '/report', icon: MdInsights, label: 'Report' },
        { to: '/settings', icon: MdSettings, label: 'Settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-100 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] select-none shadow-sm">
            <div className="flex justify-between items-center h-16 max-w-lg mx-auto px-2">
                {navItems.map(({ to, icon: Icon, label, isCenter }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `
              relative flex flex-col items-center justify-center transition-all duration-300 outline-none focus:outline-none border-none ring-0
              ${isCenter
                                ? 'w-14 h-14 -mt-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40 text-white hover:bg-blue-700 hover:scale-105'
                                : `w-14 h-full space-y-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200'}`
                            }
            `}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <Icon className={isCenter ? "w-8 h-8" : "w-6 h-6"} />
                        {!isCenter && <span className="text-[9px] font-bold tracking-wide">{label}</span>}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
