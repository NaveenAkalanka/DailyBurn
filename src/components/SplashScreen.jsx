import React, { useState } from "react";

export default function SplashScreen({ onComplete }) {
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleStart = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            onComplete();
        }, 700); // Matches transition duration
    };

    if (!onComplete) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-opacity duration-700 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex flex-col items-center justify-center h-full w-full">
                {/* Logo Reveal - Bottom to Top */}
                <div className="animate-slide-up-reveal mb-8 relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
                    <img src="/DailyBurn.svg" alt="DailyBurn Logo" className="h-48 w-48 object-contain relative z-10 drop-shadow-2xl" />
                </div>

                {/* Text Fade In - Staggered */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
                        DailyBurn
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-fade-in opacity-0" style={{ animationDelay: '1.2s' }}>
                        Doing Something is Better than Doing Nothing...
                    </p>
                </div>

                {/* Start Button */}
                <div className="mt-16 animate-fade-in opacity-0" style={{ animationDelay: '1.8s' }}>
                    <button
                        onClick={handleStart}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-3 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Let's Start
                    </button>
                </div>
            </div>
        </div>
    );
}
