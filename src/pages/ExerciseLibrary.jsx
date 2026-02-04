import React, { useState } from "react";
import { MdChevronLeft, MdSearch, MdFilterList, MdFitnessCenter, MdBolt, MdWhatshot, MdMonitorHeart, MdPlayCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { EXERCISE_LIBRARY } from "../data/exercises.js";
import { Button } from "../components/ui.jsx";

const ICONS = {
    phosphagen: <MdBolt className="h-4 w-4 text-yellow-500" />,
    glycolytic: <MdWhatshot className="h-4 w-4 text-orange-500" />,
    oxidative: <MdMonitorHeart className="h-4 w-4 text-green-500" />
};

export default function ExerciseLibrary() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [selectedPattern, setSelectedPattern] = useState("All");

    const levels = ["All", "Beginner", "Intermediate", "Advanced"];

    const patterns = ["All", ...new Set(EXERCISE_LIBRARY.map(e => e.pattern).filter(Boolean))];

    const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Merge Expert into Advanced for filtering
        const matchesLevel = selectedLevel === "All" ||
            (selectedLevel === "Advanced" ? (ex.level === "Advanced" || ex.level === "Expert") : ex.level === selectedLevel);
        const matchesPattern = selectedPattern === "All" || ex.pattern === selectedPattern;
        return matchesSearch && matchesLevel && matchesPattern;
    });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 pb-3 pt-[calc(env(safe-area-inset-top)+1.5rem)] flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <MdChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Exercise Library</h1>
                    <p className="text-xs text-slate-500">{filteredExercises.length} results</p>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 space-y-4 sticky top-[calc(61px+env(safe-area-inset-top))] z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="grid grid-cols-1 pb-20">
                {filteredExercises.map(ex => (
                    <div key={ex.id} className="bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 grid grid-cols-[4rem_1fr_3rem] gap-4 items-center min-h-[7rem]">
                        {/* Icon Placeholder */}
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                            <MdFitnessCenter className="h-8 w-8 text-slate-300" />
                        </div>

                        <div className="flex flex-col justify-center min-w-0 h-full">
                            <div className="mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 text-sm min-h-[2.5em] flex items-center">{ex.name}</h3>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{ex.pattern} • {ex.sub_pattern}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap w-fit ${ex.level === "Beginner" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                    ex.level === "Intermediate" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                    }`}>
                                    {ex.level === "Expert" ? "Advanced" : ex.level}
                                </span>
                            </div>
                        </div>

                        {/* Tutorial Link (Right) */}
                        <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " exercise tutorial")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-12 h-12 rounded-xl flex items-center justify-center transition-colors self-center justify-self-end"
                            title="Watch Tutorial"
                        >
                            <MdPlayCircle className="h-6 w-6" />
                        </a>
                    </div>
                ))}
            </div >
        </div >
    );
}
