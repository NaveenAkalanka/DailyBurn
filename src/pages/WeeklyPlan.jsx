import React from "react";
import { ChevronLeft, Dumbbell, Calendar, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { Button } from "../components/ui.jsx";
import { ExerciseRow } from "../components/day/DayDetail.jsx";

export default function WeeklyPlan() {
    const navigate = useNavigate();
    const { currentPlan } = useUser();

    if (!currentPlan || currentPlan.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-2">No Plan Found</h2>
                <p className="text-slate-500 mb-6">Please generate a plan first.</p>
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Full Weekly Schedule</h1>
            </div>

            <div className="p-4 space-y-8 pb-12">
                {currentPlan.map((day, i) => (
                    <div key={i} className="space-y-4">
                        {/* Day Header */}
                        <div className="flex items-center justify-between sticky top-[60px] z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">{day.day}</h2>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5 opacity-80">
                                    {day.type} • {day.systemFocus}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                                onClick={() => navigate(`/day/${day.day.replace(" ", "").toLowerCase()}`)}
                            >
                                View Details
                            </Button>
                        </div>

                        {/* Content Preview */}
                        <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2 sm:ml-4">
                            {day.rawBlocks.map((block, j) => (
                                <div key={j} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{block.name}</span>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">{block.style || "Standard"}</span>
                                    </div>
                                    <div>
                                        {block.exercises.map((ex, k) => (
                                            <ExerciseRow key={k} ex={ex} system={day.system} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
