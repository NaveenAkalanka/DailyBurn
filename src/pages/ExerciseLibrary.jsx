import React, { useState } from "react";
import { ChevronLeft, Search, Filter, Dumbbell, Zap, Flame, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EXERCISE_LIBRARY } from "../data/exercises.js";
import { Button } from "../components/ui.jsx";

const ICONS = {
    phosphagen: <Zap className="h-4 w-4 text-yellow-500" />,
    glycolytic: <Flame className="h-4 w-4 text-orange-500" />,
    oxidative: <Activity className="h-4 w-4 text-green-500" />
};

export default function ExerciseLibrary() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [selectedPattern, setSelectedPattern] = useState("All");

    const levels = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

    const patterns = ["All", ...new Set(EXERCISE_LIBRARY.map(e => e.pattern).filter(Boolean))];

    const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = selectedLevel === "All" || ex.level === selectedLevel;
        const matchesPattern = selectedPattern === "All" || ex.pattern === selectedPattern;
        return matchesSearch && matchesLevel && matchesPattern;
    });

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
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Exercise Library</h1>
                    <p className="text-xs text-slate-500">{EXERCISE_LIBRARY.length} Total Movements</p>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 space-y-4 sticky top-[61px] z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Level Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {levels.map(l => (
                        <button
                            key={l}
                            onClick={() => setSelectedLevel(l)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedLevel === l
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {patterns.map(p => (
                        <button
                            key={p}
                            onClick={() => setSelectedPattern(p)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedPattern === p
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="p-4 grid grid-cols-1 gap-4 pb-20">
                {filteredExercises.map(ex => (
                    <div key={ex.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4">
                        {/* Icon Placeholder */}
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                            <Dumbbell className="h-8 w-8 text-slate-300" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate pr-2">{ex.name}</h3>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{ex.pattern} • {ex.sub_pattern}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ex.level === "Beginner" ? "bg-green-100 text-green-700" :
                                    ex.level === "Intermediate" ? "bg-blue-100 text-blue-700" :
                                        "bg-purple-100 text-purple-700"
                                    }`}>
                                    {ex.level}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {/* System Affinity Badges */}
                                {Object.entries(ex.system_affinity).map(([sys, val]) => (
                                    val >= 5 && (
                                        <div key={sys} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700">
                                            {ICONS[sys]}
                                            <span className="capitalize">{sys}</span>
                                        </div>
                                    )
                                ))}

                                {/* Requirement Badges */}
                                {ex.requirements.map(req => (
                                    <span key={req} className="text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
