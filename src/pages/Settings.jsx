import React from 'react';
import { useUser } from '../context/UserContext.jsx';
import { Button } from '../components/ui.jsx';
import { MdDelete, MdDarkMode, MdLightMode, MdChevronLeft } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Settings() {
    const { resetInputs } = useUser();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);

    const handleReset = () => {
        resetInputs();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 pb-3 pt-[calc(env(safe-area-inset-top)+1.5rem)] flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <MdChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Theme Section */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Appearance</h2>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? <MdDarkMode className="h-5 w-5 text-purple-500" /> : <MdLightMode className="h-5 w-5 text-orange-500" />}
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
                            onClick={() => setIsResetDialogOpen(true)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 font-bold border-none"
                        >
                            <MdDelete className="mr-2 h-4 w-4" /> Reset All Data
                        </Button>
                    </div>
                </section>

                {/* Developer Section */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Developer</h2>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Designed & Developed by</p>
                        <a
                            href="https://github.com/NaveenAkalanka"
                            target="_blank"
                            rel="noreferrer"
                            className="text-lg font-black text-blue-600 dark:text-blue-400 hover:underline block mb-4"
                        >
                            Naveen Akalanka
                        </a>

                        <a href="https://www.buymeacoffee.com/naveenakalanka" target="_blank" rel="noreferrer" className="inline-block transition-transform hover:scale-105">
                            <img
                                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                                alt="Buy Me A Coffee"
                                className="h-10 w-auto"
                            />
                        </a>
                    </div>
                </section>

                <div className="text-center pt-8">
                    <p className="text-xs text-slate-400">DailyBurn v1.0.0</p>
                    <Link to="/debug" className="text-[10px] text-slate-800 dark:text-slate-400 mt-4 block p-4">DevTools</Link>
                </div>
            </div>
            {/* Reset Confirmation Modal */}
            {isResetDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Reset Application?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                This will <strong>permanently delete</strong> all workout history, settings, and personal data. This action cannot be undone.
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsResetDialogOpen(false)}
                                    className="h-12 font-bold border-slate-200 dark:border-slate-700 dark:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsResetDialogOpen(false);
                                        handleReset();
                                    }}
                                    className="h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30"
                                >
                                    Yes, Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
