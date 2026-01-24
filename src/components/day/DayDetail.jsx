import React from "react";
import { ChevronLeft, Menu, ArrowRightLeft, Dumbbell, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui.jsx";

// Helper for short rep strings based on system/category
const getShortPrescription = (blockSystem, exCategory, meta) => {
  if (blockSystem === "Oxidative" || exCategory === "cardio") return "00:45"; // seconds
  if (blockSystem === "Phosphagen" || exCategory === "strength") return `x${Math.floor(Math.random() * (8 - 5 + 1) + 5)}`; // x5-8
  return `x${Math.floor(Math.random() * (15 - 12 + 1) + 12)}`; // x12-15
};

export const ExerciseRow = ({ ex, system, meta }) => {
  const shortRep = getShortPrescription(system, ex.category, meta);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " exercise tutorial")}`;

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* Drag Handle */}
      <Menu className="text-slate-300 h-5 w-5 shrink-0" />

      {/* Visual Placeholder (Image) */}
      <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-slate-400">
        <Dumbbell className="h-6 w-6 opacity-50" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">
          {ex.name}
        </h4>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {shortRep}
        </p>
      </div>

      {/* Swap / Actions */}
      <a
        href={youtubeSearchUrl}
        target="_blank"
        rel="noreferrer"
        className="text-slate-300 hover:text-blue-500 p-2"
      >
        <ArrowRightLeft className="h-5 w-5" />
      </a>
    </div>
  );
};

export const DayDetailCard = ({ d }) => {
  const navigate = useNavigate();

  // Calculate total exercises
  const totalExercises = d.rawBlocks.reduce((acc, block) => {
    return acc + (block.exercises ? block.exercises.length : 0);
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">

      {/* Navbarish Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 dark:border-slate-800">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{d.day} Workout</h1>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 px-6 py-6 font-sans">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-2xl font-black text-slate-900 dark:text-white mb-1">{d.duration} mins</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Duration</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-2xl font-black text-slate-900 dark:text-white mb-1">{totalExercises}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Exercises</span>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 px-4 space-y-8 pb-32">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Exercises</h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit</button>
        </div>

        <div className="space-y-6">
          {d.rawBlocks.map((block, i) => (
            <div key={i} className="animate-slideUpFade" style={{ animationDelay: `${i * 100}ms` }}>
              {/* Block Header */}
              <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-t-2xl border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{block.name}</span>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                  <span className="bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                    {block.style || "10-12 reps"}
                  </span>
                </p>    </div>

              {/* Exercise List */}
              <div className="bg-white dark:bg-slate-900 border-x border-b border-slate-100 dark:border-slate-800 rounded-b-2xl overflow-hidden shadow-sm">
                {block.exercises && block.exercises.length > 0 ? (
                  block.exercises.map((ex, j) => {
                    const isBoss = ex.is_challenge;

                    return (
                      <div key={j} className={isBoss ? "relative mt-6 mb-2" : ""}>
                        {isBoss && (
                          <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                            <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg shadow-amber-500/50">
                              Boss Battle
                            </span>
                          </div>
                        )}
                        <div className={`${isBoss ? "ring-2 ring-amber-500 rounded-2xl shadow-xl shadow-amber-500/20" : ""}`}>
                          <ExerciseRow
                            ex={ex}
                            // Pass the pre-calculated target from algorithm or fallback
                            prescription={ex.target || "10-12 reps"}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400 italic">Rest or transition</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-30">
        <Button
          onClick={() => navigate('/live-session', { state: { day: d } })}
          className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-full text-lg font-bold shadow-xl shadow-slate-900/20"
        >
          Start Experience
        </Button>
      </div>

    </div>
  );
};
