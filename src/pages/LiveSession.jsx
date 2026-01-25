import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, CheckCircle, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui';

import { EXERCISE_LIBRARY } from '../data/exercises';
import { useHistory } from '../context/HistoryContext';

export default function LiveSession() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addEntry } = useHistory();

    // STATE INITIALIZATION with PERSISTENCE
    const [day, setDay] = useState(() => {
        // 1. Check if passed via navigation (fresh start)
        const navDay = location.state?.day;
        if (navDay) {
            // New session: Save to storage immediately
            localStorage.setItem('dailyburn_active_session', JSON.stringify({
                day: navDay,
                currentIndex: 0
            }));
            return navDay;
        }

        // 2. Check storage (resume)
        const savedSession = localStorage.getItem('dailyburn_active_session');
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                if (parsed.day) return parsed.day;
            } catch (e) {
                console.error("Failed to parse saved session", e);
            }
        }
        return null; // No data found
    });

    const [currentIndex, setCurrentIndex] = useState(() => {
        // Initialize index from storage if resuming, else 0
        if (location.state?.day) return 0; // New session starts at 0

        const savedSession = localStorage.getItem('dailyburn_active_session');
        if (savedSession) {
            try {
                return JSON.parse(savedSession).currentIndex || 0;
            } catch (e) { return 0; }
        }
        return 0;
    });

    // Sync Index to Storage
    useEffect(() => {
        if (day) {
            const sessionData = { day, currentIndex };
            localStorage.setItem('dailyburn_active_session', JSON.stringify(sessionData));
        }
    }, [day, currentIndex]);

    // Redirect if no data found anywhere
    useEffect(() => {
        if (!day) navigate('/');
    }, [day, navigate]);

    if (!day) return null;

    // Flatten all exercises into a single list
    const exercises = React.useMemo(() => {
        return day.rawBlocks.flatMap(block =>
            block.exercises.map(ex => {
                // FALLBACK: If timing is missing (stale plan), look it up from DB
                let timing = ex.timing;
                if (!timing) {
                    const dbEx = EXERCISE_LIBRARY.find(e => e.name === ex.name);
                    if (dbEx) timing = dbEx.timing;
                }

                return {
                    ...ex,
                    timing, // Ensure timing is attached
                    blockName: block.name,
                    blockStyle: block.style
                };
            })
        );
    }, [day]);

    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRestingState, setIsRestingState] = useState(false); // New explicit rest state
    const [restTimer, setRestTimer] = useState(6); // 6s rest
    const [isRestPaused, setIsRestPaused] = useState(false); // NEW: Pause state for rest
    const [repsCompleted, setRepsCompleted] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // ... (currentExercise, nextExercise, getTarget definitions unchanged) ... 

    const currentExercise = exercises[currentIndex];
    const nextExercise = exercises[currentIndex + 1];

    // Derived Logic for Timer / Targets
    const getTarget = (ex) => {
        if (!ex) return { type: 'time', val: 0, timeDuration: 0 };
        const isTimeBased = ex.blockStyle === "Oxidative" || (ex.target && ex.target.includes("sec"));
        const timeVal = isTimeBased ? 45 : 60;

        const getMaxReps = (valStr) => {
            if (!valStr) return 60;
            const clean = String(valStr).replace(/[^0-9-]/g, '');
            if (clean.includes('-')) {
                const parts = clean.split('-');
                return parseInt(parts[1], 10) || parseInt(parts[0], 10) || 60;
            }
            return parseInt(clean, 10) || 60;
        };

        let calculatedTime = timeVal;
        if (!isTimeBased) {
            const maxReps = getMaxReps(ex.target);
            const secPerRep = ex.timing?.seconds_per_rep || 3.0;
            calculatedTime = Math.ceil(maxReps * secPerRep);
        }

        return {
            type: isTimeBased ? 'time' : 'reps',
            val: ex.target || "10-12",
            timeDuration: calculatedTime
        };
    };

    const target = getTarget(currentExercise);

    // Initialize Timer for Workout
    useEffect(() => {
        if (currentExercise && !isRestingState && !isFinished) {
            setTimeLeft(target.timeDuration);
            setRepsCompleted(0);
            if (isAutoPlay) setIsActive(true);
        }
    }, [currentIndex, isRestingState, isFinished, target.timeDuration]); // Don't depend on isAutoPlay to prevent restart

    // MAIN TIMER LOOP (Handles both Workout and Rest timers)
    useEffect(() => {
        let interval = null;

        if (isFinished) return;

        // REST TIMER LOGIC
        if (isRestingState) {
            // Only count down if NOT paused
            if (!isRestPaused && restTimer > 0) {
                interval = setInterval(() => {
                    setRestTimer(prev => prev - 1);
                }, 1000);
            } else if (restTimer === 0) {
                // Rest Finished -> Go to Next Exercise
                setIsRestingState(false);
                setIsRestPaused(false); // Reset pause state
                if (currentIndex < exercises.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setIsFinished(true); // Should theoretically happen at end of last exercise, but safeguard
                }
            }
        }
        // WORKOUT TIMER LOGIC
        else if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    const newVal = prev - 1;

                    // Auto-Pacer Logic for Reps
                    if (target.type === 'reps') {
                        const totalTime = target.timeDuration;
                        const elapsed = totalTime - newVal;
                        const getMaxReps = (valStr) => {
                            if (!valStr) return 60;
                            const clean = String(valStr).replace(/[^0-9-]/g, '');
                            if (clean.includes('-')) {
                                const parts = clean.split('-');
                                return parseInt(parts[1], 10) || parseInt(parts[0], 10) || 60;
                            }
                            return parseInt(clean, 10) || 60;
                        };

                        const maxReps = getMaxReps(target.val);
                        const secondsPerRep = currentExercise.timing?.seconds_per_rep || 1;
                        const idealReps = Math.floor(elapsed / secondsPerRep);

                        setRepsCompleted(Math.min(idealReps, maxReps));
                    }
                    return newVal;
                });
            }, 1000);
        }
        // END OF WORKOUT SET
        else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (isAutoPlay) {
                setTimeout(() => handleNext(), 500); // Short delay before transitioning to Rest
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isRestingState, restTimer, isRestPaused, isFinished, isAutoPlay, currentIndex, exercises.length]);


    const handleNext = () => {
        // If we are at the very end
        if (currentIndex >= exercises.length - 1) {
            setIsFinished(true);
            return;
        }

        // Trigger Rest Interval
        setIsRestingState(true);
        setIsRestPaused(false); // Ensure starts unpaused
        setRestTimer(6); // Reset rest timer
    };


    const skipRest = () => {
        setIsRestingState(false);
        setIsRestPaused(false);
        // Explicitly START the next workout immediately
        setIsActive(true);

        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    // ... (handlePrev, toggleTimer, completeWorkout unchanged, verify they are kept by replace logic if not targeted) ...
    // Note: I am replacing a huge chunk so I need to include them or be careful.
    // Actually, I can target specific range if I am careful.
    // Let's replace from state init to handleNext end.

    // Re-declare missed functions since I am replacing a block that likely covers them
    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsRestingState(false); // Cancel rest if going back
            setCurrentIndex(currentIndex - 1);
        }
    };

    const toggleTimer = () => {
        // If restarting finished set
        if (timeLeft === 0 && !isRestingState) {
            setTimeLeft(target.timeDuration);
            setRepsCompleted(0);
            setIsActive(true);
            return;
        }
        setIsActive(!isActive);
    };

    const completeWorkout = () => {
        addEntry({
            dayName: day.day,
            duration: day.duration,
            type: day.type,
            focus: day.systemFocus
        });
        localStorage.removeItem('dailyburn_active_session');
        navigate('/');
    };

    // RENDER: COMPLETION SCREEN
    if (isFinished) {
        return (
            <div className="flex flex-col min-h-screen bg-indigo-950 text-white items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="absolute top-0 inset-x-0 h-64 bg-indigo-500/20 blur-3xl pointer-events-none"></div>
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
                    <CheckCircle className="w-24 h-24 text-indigo-400 relative z-10" />
                </div>
                <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                    Session Complete!
                </h1>
                <p className="text-indigo-200 text-lg mb-12 max-w-sm">
                    You crushed today's {day.day} session. Great work staying consistent.
                </p>

                <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-xs">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="text-3xl font-black text-white">{exercises.length}</div>
                        <div className="text-xs font-bold text-indigo-300 uppercase">Exercises</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="text-3xl font-black text-white">{day.duration}</div>
                        <div className="text-xs font-bold text-indigo-300 uppercase">Minutes</div>
                    </div>
                </div>

                <Button
                    onClick={completeWorkout}
                    className="w-full max-w-md h-16 text-xl font-bold bg-white hover:bg-indigo-50 text-indigo-900 shadow-xl border-none"
                >
                    Finish & Log Workout
                </Button>
            </div>
        );
    }

    // RENDER: REST SCREEN
    if (isRestingState) {
        return (
            <div className="flex flex-col min-h-screen bg-indigo-950 text-white items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

                {/* Content Wrapper with Z-Index */}
                <div className="relative z-10 w-full flex flex-col items-center">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-200 mb-8 animate-pulse">
                        {isRestPaused ? "REST PAUSED" : "GET READY"}
                    </h2>

                    <div className="text-[12rem] font-black leading-none mb-4 tabular-nums text-white">
                        {restTimer}
                    </div>

                    <div className="mb-8">
                        <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Up Next</p>
                        <h3 className="text-3xl font-black text-white">{nextExercise?.name || "Finish Line"}</h3>
                    </div>

                    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                        <Button
                            onClick={() => setIsRestPaused(!isRestPaused)}
                            className="w-full bg-indigo-900/50 hover:bg-indigo-900 text-indigo-100 border-2 border-indigo-700/50 rounded-xl px-8 py-4 h-auto font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            {isRestPaused ? <><Play className="w-5 h-5 fill-current" /> Resume Rest</> : <><Pause className="w-5 h-5 fill-current" /> Pause Rest</>}
                        </Button>

                        <Button
                            onClick={skipRest}
                            className="w-full bg-white text-indigo-950 hover:bg-indigo-50 border-none rounded-xl px-8 py-4 h-auto font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            Start Now <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: ACTIVE WORKOUT
    const progressPercent = ((currentIndex + 1) / exercises.length) * 100;

    // Circular Progress Calculation
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((target.timeDuration - timeLeft) / target.timeDuration) * circumference;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="font-bold text-lg">{day.day} Session</span>

                {/* Auto-Play Toggle */}
                <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isAutoPlay
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
                        : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        }`}
                >
                    {isAutoPlay ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                    {isAutoPlay ? "Auto-Play ON" : "Auto-Play OFF"}
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-900">
                <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 text-center">

                {/* Meta */}
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {currentExercise.blockName} • {currentIndex + 1} of {exercises.length}
                    </span>
                    <h1 className="text-4xl font-black leading-tight">
                        {currentExercise.name}
                    </h1>
                    {target.type === 'reps' && (
                        <div className="inline-block bg-slate-200 dark:bg-slate-800 px-4 py-1.5 rounded-full mt-2">
                            <span className="text-lg font-bold text-slate-700 dark:text-slate-300">Target: {target.val} reps</span>
                        </div>
                    )}
                </div>

                {/* VISUAL TIMER: CIRCULAR PROGRESS */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                        <circle
                            cx="144"
                            cy="144"
                            r={radius}
                            className="stroke-slate-200 dark:stroke-slate-800"
                            strokeWidth="12" // Thicker stroke
                            fill="none"
                        />
                        <circle
                            cx="144"
                            cy="144"
                            r={radius}
                            className={`transition-all duration-1000 ease-linear ${timeLeft === 0 ? "stroke-emerald-500" : "stroke-blue-600"
                                }`}
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Timer Text */}
                    <div className="relative z-10 flex flex-col items-center">
                        <span className={`text-7xl font-black tabular-nums tracking-tighter transition-colors ${timeLeft === 0 ? "text-emerald-500" : "text-slate-900 dark:text-white"
                            }`}>
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-bold opacity-50 mt-2 uppercase tracking-widest">
                            {timeLeft === 0 ? "Complete" : isActive ? "Running" : "Paused"}
                        </span>
                    </div>
                </div>

                {/* Rep Counter Controls (Only for Reps) */}
                {target.type === 'reps' && (
                    <div className="flex flex-col items-center mt-2 space-y-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500">
                            <RotateCcw className="w-3 h-3 animate-spin py-0.5 duration-[3000ms]" />
                            <span>Tempo: 1 rep every {currentExercise.timing?.seconds_per_rep || 1}s</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center min-w-[80px]">
                                <span className="text-4xl font-black text-blue-600 dark:text-blue-400 tabular-nums animate-in slide-in-from-bottom-2 fade-in duration-300">
                                    {repsCompleted}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Rep Count</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="w-full max-w-md space-y-4">
                    {/* Timer Control */}
                    <Button
                        onClick={toggleTimer}
                        className={`w-full h-16 text-xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-all ${isActive
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                            }`}
                    >
                        {timeLeft === 0 ? (
                            <><RotateCcw className="fill-current" /> Restart Timer</>
                        ) : (
                            isActive ? <><Pause className="fill-current" /> Pause Timer</> : <><Play className="fill-current" /> Start Timer</>
                        )}
                    </Button>

                    {/* Navigation Control */}
                    <Button
                        onClick={handleNext}
                        variant="soft"
                        className={`w-full h-14 font-semibold text-lg flex items-center justify-center gap-2 ${target.type === 'reps' && timeLeft === 0 ? "bg-emerald-100 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-900/20" : ""}`}
                    >
                        {target.type === 'reps' ? <><CheckCircle className="w-5 h-5" /> Log {repsCompleted} & Next</> : "Skip / Next"}
                    </Button>
                </div>
            </div>

            {/* Boss Battle Skip Option */}
            {currentExercise.is_challenge && (
                <button
                    onClick={() => setIsSkipDialogOpen(true)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-4 transition-colors p-2 mb-4 self-center"
                >
                    Too Hard?
                </button>
            )}


            {/* Skip Boss Modal */}
            {
                isSkipDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                    💪
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Good Effort!</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                    Boss Battles are meant to be near-impossible.<br />
                                    It's totally okay to skip properly and try again next week. You still crushed this workout!
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSkipDialogOpen(false)}
                                        className="h-12 font-bold border-slate-200 dark:border-slate-700"
                                    >
                                        Keep Trying
                                    </Button>
                                    <Button
                                        onClick={() => { setIsSkipDialogOpen(false); handleNext(); }}
                                        className="h-12 font-bold bg-slate-900 text-white hover:bg-slate-800"
                                    >
                                        Skip Boss
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Navigation Footer */}
            <div className="p-6 flex justify-between items-center text-slate-400">
                <button
                    disabled={currentIndex === 0}
                    onClick={handlePrev}
                    className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                <div className="flex gap-1">
                    {/* Dots? Maybe too many. */}
                </div>
                <button
                    onClick={handleNext}
                    className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    Next <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div >
    );
}
