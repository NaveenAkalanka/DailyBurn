import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdChevronLeft } from 'react-icons/md';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    // Hide bottom nav on immersive pages like LiveSession
    const showBottomNav = !location.pathname.startsWith('/live-session');

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300 pt-[env(safe-area-inset-top)]">
            {/* Mesh Gradient - Light */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60 dark:opacity-20 mix-blend-multiply dark:mix-blend-normal bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-slate-800"></div>
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60 dark:opacity-20 mix-blend-multiply dark:mix-blend-normal bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-slate-800"></div>



            {/* Main Content */}
            <main className={`flex-1 w-full max-w-3xl mx-auto px-4 relative z-10 ${showBottomNav ? 'pb-24' : 'pb-[calc(env(safe-area-inset-bottom)+2rem)]'}`}>
                {children}
            </main>

            {/* Bottom Navigation */}
            {showBottomNav && <BottomNav />}
        </div>
    );
}
