import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, CheckCircle, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui';

export default function LiveSession() {
    const location = useLocation();
    const navigate = useNavigate();
    const { day } = location.state || {};

    // Redirect if no data
    useEffect(() => {
        if (!day) navigate('/');
    }, [day, navigate]);

    if (!day) return null;

    // Flatten all exercises into a single list
    const exercises = React.useMemo(() => {
        return day.rawBlocks.flatMap(block =>
            block.exercises.map(ex => ({ ...ex, blockName: block.name, blockStyle: block.style }))
        );
    }, [day]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [repsCompleted, setRepsCompleted] = useState(0);

    const currentExercise = exercises[currentIndex];

    // Parse duration or reps
    const getTarget = (ex) => {
        const isTimeBased = ex.blockStyle === "Oxidative" || (ex.target && ex.target.includes("sec"));

        // Universal Timer Logic
        // Time-based: 45s default (or parsed)
        // Rep-based: 60s default (pacing window)
        const timeVal = isTimeBased ? 45 : 60;

        return {
            type: isTimeBased ? 'time' : 'reps',
            val: ex.target || "10-12",
            timeDuration: timeVal
        };
    };

    const target = getTarget(currentExercise);

    // Initialize Timer
    useEffect(() => {
        setIsActive(false);
        setIsResting(false);
        // Force set the timer duration, regardless of exercise type
        setTimeLeft(target.timeDuration);
        setRepsCompleted(0);
    }, [currentIndex, target.timeDuration]);

    const adjustReps = (amount) => {
        setRepsCompleted(prev => Math.max(0, prev + amount));
    };

    // Timer Tick
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    const newVal = prev - 1;

                    // Auto-Pacer Logic for Reps
                    if (target.type === 'reps') {
                        const totalTime = target.timeDuration;
                        const elapsed = totalTime - newVal; // Time passed

                        // Sync Reps to Timer (1 rep per second)
                        // "Match the timer value" -> 1 tick = 1 rep
                        setRepsCompleted(elapsed);
                    }

                    return newVal;
                });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer reached zero - auto stop
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleNext = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Finished
            navigate('/');
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const progressPercent = ((currentIndex + 1) / exercises.length) * 100;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="font-bold text-lg">{day.day} Session</span>
                <div className="w-8" />
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
                    {/* Rep Target Badge - Shown for Rep Exercises */}
                    {target.type === 'reps' && (
                        <div className="inline-block bg-slate-200 dark:bg-slate-800 px-4 py-1.5 rounded-full mt-2">
                            <span className="text-lg font-bold text-slate-700 dark:text-slate-300">Target: {target.val} reps</span>
                        </div>
                    )}
                </div>

                {/* Timer Display (Always Visible for ALL types) */}
                <div className={`w-64 h-64 rounded-full border-8 flex flex-col items-center justify-center relative overflow-hidden bg-white dark:bg-slate-900 shadow-xl transition-colors duration-300 ${timeLeft === 0
                    ? "border-green-500 text-green-600 dark:text-green-500"
                    : isActive
                        ? "border-blue-500"
                        : "border-slate-200 dark:border-slate-800"
                    }`}>
                    <span className="text-6xl font-black tabular-nums tracking-tighter">
                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold opacity-50 mt-2 uppercase">
                        {timeLeft === 0 ? "Complete" : isActive ? "Running" : "Paused"}
                    </span>
                </div>

                {/* Rep Counter Controls (Only for Reps) */}
                {target.type === 'reps' && (
                    <div className="flex flex-col items-center mt-6 space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center min-w-[80px]">
                                <span className="text-6xl font-black text-blue-600 dark:text-blue-400 tabular-nums animate-in slide-in-from-bottom-2 fade-in duration-300">
                                    {repsCompleted}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Rep Count</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500">
                            <RotateCcw className="w-3 h-3 animate-spin py-0.5 duration-[3000ms]" />
                            <span>Tempo: Matching Timer (1 rep/sec)</span>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="w-full max-w-md space-y-4">
                    {/* Timer Control (Now Universal) */}
                    <Button
                        onClick={toggleTimer}
                        className={`w-full h-16 text-xl font-bold rounded-2xl flex items-center justify-center gap-3 transition-all ${isActive
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                            }`}
                    >
                        {isActive ? <><Pause className="fill-current" /> Pause Timer</> : <><Play className="fill-current" /> Start Timer</>}
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
        </div>
    );
}
