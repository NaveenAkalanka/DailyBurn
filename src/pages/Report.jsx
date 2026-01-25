import React from 'react';
import { ChevronLeft, Trophy, Clock, Calendar, Activity, Zap, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext.jsx';
import { Card, CardContent } from '../components/ui.jsx';

export default function Report() {
    const navigate = useNavigate();
    const { history } = useHistory();

    const totalWorkouts = history.length;
    const totalMinutes = history.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);
    const lastWorkoutDate = history.length > 0 ? new Date(history[0].completedAt).toLocaleDateString() : "N/A";

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    const getIcon = (type) => {
        // Heuristic based on type/focus strings
        if (String(type).toLowerCase().includes("power") || String(type).toLowerCase().includes("phosphagen")) return <Zap className="h-4 w-4 text-yellow-500" />;
        if (String(type).toLowerCase().includes("metabolic") || String(type).toLowerCase().includes("glycolytic")) return <Flame className="h-4 w-4 text-orange-500" />;
        return <Activity className="h-4 w-4 text-blue-500" />;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Your Progress</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white shadow-lg shadow-blue-500/20">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Trophy className="h-8 w-8 mb-2 opacity-80" />
                            <span className="text-3xl font-black">{totalWorkouts}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Completed</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Clock className="h-8 w-8 mb-2 text-slate-400" />
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{totalMinutes}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Mins</span>
                        </CardContent>
                    </Card>
                </div>

                {/* History List */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-slate-400" /> Recent Activity
                    </h3>

                    {history.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <Activity className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No workouts yet.</p>
                            <p className="text-xs text-slate-400 mt-1">Complete a session to start tracking!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((entry) => (
                                <div key={entry.id || entry.completedAt} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                                        {getIcon(entry.focus || entry.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{entry.dayName}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            {formatDate(entry.completedAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-slate-900 dark:text-white">{entry.duration}m</span>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">{entry.focus || "Workout"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
