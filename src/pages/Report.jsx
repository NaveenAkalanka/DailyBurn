import React, { useState } from 'react';
import { MdChevronLeft, MdEmojiEvents, MdAccessTime, MdCalendarToday, MdMonitorHeart, MdBolt, MdWhatshot, MdInsights, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext.jsx';
import { useUser } from '../context/UserContext.jsx';
import { Card, CardContent } from '../components/ui.jsx';
import SystemChart from '../components/charts/SystemChart.jsx';
import VolumeChart from '../components/charts/VolumeChart.jsx';
import RadarProfile from '../components/charts/RadarProfile.jsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getDay, addMonths, subMonths } from 'date-fns';

export default function Report() {
    const navigate = useNavigate();
    const { history } = useHistory();
    const { inputs } = useUser(); // Access user schedule (e.g., selectedDays: ["Monday", "Wednesday"])

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    // Month Navigation
    // Lock navigation if current month is the same as start month
    const startDate = inputs?.startDate ? new Date(inputs.startDate) : new Date();
    const isStartMonth = isSameMonth(currentDate, startDate);

    // Allow going back only if NOT in start month
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => {
        if (!isStartMonth) setCurrentDate(subMonths(currentDate, 1));
    };

    // Stats Logic (Overall)
    const totalWorkouts = history.length;
    const totalMinutes = history.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);

    // Filter History for Selected Month
    const monthlyHistory = history.filter(entry => isSameMonth(new Date(entry.completedAt), currentDate));
    // Sort by date descending
    monthlyHistory.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    const getIcon = (type) => {
        if (String(type).toLowerCase().includes("power") || String(type).toLowerCase().includes("phosphagen")) return <MdBolt className="h-4 w-4 text-yellow-500" />;
        if (String(type).toLowerCase().includes("metabolic") || String(type).toLowerCase().includes("glycolytic")) return <MdWhatshot className="h-4 w-4 text-orange-500" />;
        return <MdMonitorHeart className="h-4 w-4 text-blue-500" />;
    };

    // --- CALENDAR LOGIC ---
    const generateCalendarDays = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const days = eachDayOfInterval({ start, end });

        // Padding for start of month
        const startDay = getDay(start); // 0 (Sun) to 6 (Sat)
        // Adjust for Monday start if needed, but standard US calendar is fine for now
        const padding = Array(startDay).fill(null);

        return [...padding, ...days];
    };

    const getDayStatus = (day) => {
        if (!day) return 'empty';

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const currentDayName = dayNames[getDay(day)];
        const isScheduled = inputs?.selectedDays?.includes(currentDayName);

        // 1. Check History Match
        // Find if any workout happened on this specific date
        const historyEntry = history.find(entry => isSameDay(new Date(entry.completedAt), day));

        if (historyEntry) {
            // Check for Make-up (Purple)
            if (historyEntry.dayName && historyEntry.dayName !== currentDayName) {
                return 'makeup';
            }
            return 'completed';
        }

        // --- NEW: Time Machine Lock ---
        // If this day is BEFORE the Start Date (and no workout was done), show nothing (plain)
        // Ignore time part for day comparison
        if (day < new Date(startDate.setHours(0, 0, 0, 0))) {
            return 'plain';
        }

        // 2. Check Missed (Red)
        // If scheduled, no history, and IS IN PAST
        const isPast = day < new Date().setHours(0, 0, 0, 0); // Strictly in past, not today
        if (isScheduled && isPast) {
            return 'missed';
        }

        // 3. Planned Future/Today
        if (isScheduled) return 'scheduled';

        return 'plain';
    };

    const calendarGrid = generateCalendarDays();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 pb-3 pt-[calc(env(safe-area-inset-top)+1.5rem)] flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <MdChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Your Progress</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white shadow-lg shadow-blue-500/20 h-full">
                        <CardContent className="!p-4 flex flex-col items-center justify-center text-center h-full">
                            <MdEmojiEvents className="h-8 w-8 mb-2 opacity-80" />
                            <span className="text-3xl font-black">{totalWorkouts}</span>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Completed</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-full">
                        <CardContent className="!p-4 flex flex-col items-center justify-center text-center h-full">
                            <MdAccessTime className="h-8 w-8 mb-2 text-slate-400" />
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{totalMinutes}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Mins</span>
                        </CardContent>
                    </Card>
                </div>

                {/* CALENDAR SECTION */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={prevMonth}
                            disabled={isStartMonth}
                            className={`p-2 rounded-full transition-colors ${isStartMonth ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <MdChevronLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <MdCalendarToday className="text-blue-500" /> {format(currentDate, 'MMMM yyyy')}
                        </h3>
                        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <MdChevronLeft className="h-5 w-5 rotate-180" />
                        </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={`${d}-${i}`} className="text-xs font-bold text-slate-400">{d}</div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarGrid.map((day, i) => {
                            if (!day) return <div key={i} className="aspect-square"></div>;

                            const status = getDayStatus(day);
                            const isToday = isSameDay(day, new Date());

                            let bgClass = "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors";
                            if (status === 'completed') {
                                bgClass = "bg-amber-400 text-amber-950 shadow-md ring-1 ring-amber-500 font-black"; // HIGH VIS GOLD
                            } else if (status === 'scheduled') {
                                bgClass = "bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold"; // HIGH VIS BLUE
                            } else if (status === 'missed') {
                                bgClass = "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold ring-1 ring-rose-200 dark:ring-rose-800"; // RED WARNING
                            } else if (status === 'makeup') {
                                bgClass = "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold ring-1 ring-purple-200 dark:ring-purple-800"; // PURPLE MAKEUP
                            }

                            if (isToday && status !== 'completed') {
                                bgClass += " ring-2 ring-blue-500 ring-inset relative z-10";
                            }

                            return (
                                <div key={`day-${i}`} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${bgClass}`}>
                                    <span>{format(day, 'd')}</span>
                                    {status === 'completed' && <MdCheckCircle className="w-3 h-3 absolute bottom-1" />}
                                    {status === 'makeup' && <MdCheckCircle className="w-3 h-3 absolute bottom-1 text-purple-500" />}
                                    {status === 'missed' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute bottom-2"></div>}
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 justify-center text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-md bg-blue-600 shadow-sm"></div> Planned</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-md bg-amber-400 border border-amber-500 shadow-sm"></div> Done</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-md bg-rose-200 border border-rose-300 shadow-sm"></div> Missed</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-md bg-purple-200 border border-purple-300 shadow-sm"></div> Catch Up</div>
                    </div>
                </div>

                {/* CHARTS SECTION */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <VolumeChart history={history} />
                        <RadarProfile history={history} />
                    </div>
                    <SystemChart history={history} />
                </div>

                {/* History List */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                        <span>History for {format(currentDate, 'MMMM')}</span>
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{monthlyHistory.length} Sessions</span>
                    </h3>

                    {monthlyHistory.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <MdInsights className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No workouts this month.</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {isSameMonth(currentDate, new Date()) ? "Time to get started!" : "Select another month."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {monthlyHistory.map((entry, index) => (
                                <div key={`${entry.id || entry.completedAt}-${index}`} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
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
