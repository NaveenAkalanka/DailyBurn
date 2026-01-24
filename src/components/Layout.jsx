import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
            {/* Mesh Gradient - Light */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent"></div>
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>

            {/* Mobile App Bar - Hidden on Immersive Pages (DayView) */}
            {!location.pathname.startsWith('/day/') && (
                <header className="sticky top-0 z-50 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 px-4 bg-white/85 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-colors">
                    <div className="max-w-3xl mx-auto flex items-center justify-between h-10 w-full">
                        <div className="flex items-center gap-3">
                            {!isHome ? (
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                            ) : (
                                <Link to="/" className="flex items-center gap-3 group active:scale-95 transition-transform">
                                    <img src="/DailyBurn.svg" alt="DailyBurn Logo" className="h-8 w-8 object-contain" />
                                    <div>
                                        <h1 className="text-lg font-bold text-slate-900 leading-none tracking-tight">DailyBurn</h1>
                                    </div>
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {!isHome && <div className="text-sm font-semibold text-slate-900 truncate max-w-[150px] opacity-0 animate-fadeIn">
                                {/* Optional: Add page title here if we want */}
                            </div>}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full max-w-3xl mx-auto px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)] relative z-10">
                {children}
            </main>
        </div>
    );
}
