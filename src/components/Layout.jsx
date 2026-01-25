import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    // Hide bottom nav on immersive pages like LiveSession
    const showBottomNav = !location.pathname.startsWith('/live-session');

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
            {/* Mesh Gradient - Light */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent"></div>
            <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>



            {/* Main Content */}
            <main className={`flex-1 w-full max-w-3xl mx-auto px-4 relative z-10 ${showBottomNav ? 'pb-24' : 'pb-[calc(env(safe-area-inset-bottom)+2rem)]'}`}>
                {children}
            </main>

            {/* Bottom Navigation */}
            {showBottomNav && <BottomNav />}
        </div>
    );
}
