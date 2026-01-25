import React from 'react';
import { useUser } from '../context/UserContext.jsx';
import { Button } from '../components/ui.jsx';
import { Trash2, Moon, Sun, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Settings() {
    const { resetInputs } = useUser();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset your plan? This will clear all data.")) {
            resetInputs();
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Theme Section */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Appearance</h2>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? <Moon className="h-5 w-5 text-purple-500" /> : <Sun className="h-5 w-5 text-orange-500" />}
                            <span className="font-semibold text-slate-900 dark:text-white">Dark Mode</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </section>

                {/* Data Section */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Data Management</h2>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white">Reset Application</h3>
                            <p className="text-xs text-slate-500 mt-1">Clear all workout data and personalization settings.</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Reset All Data
                        </Button>
                    </div>
                </section>

                <div className="text-center pt-8">
                    <p className="text-xs text-slate-400">DailyBurn v1.0.0</p>
                </div>
            </div>
        </div>
    );
}
