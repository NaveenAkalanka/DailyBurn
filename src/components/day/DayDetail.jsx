import React from "react";
import ReactDOM from "react-dom";
import { MdChevronLeft, MdMenu, MdSwapHoriz, MdFitnessCenter, MdPlayCircle, MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui.jsx";
import { EXERCISE_LIBRARY } from "../../data/exercises";
import { useUser } from "../../context/UserContext.jsx";

// Helper for short rep strings based on system/category
const getShortPrescription = (blockSystem, exCategory, meta) => {
  if (blockSystem === "Oxidative" || exCategory === "cardio") return "00:45"; // seconds
  if (blockSystem === "Phosphagen" || exCategory === "strength") return `x${Math.floor(Math.random() * (8 - 5 + 1) + 5)}`; // x5-8
  return `x${Math.floor(Math.random() * (15 - 12 + 1) + 12)}`; // x12-15
};

// Swap Modal Component
const SwapModal = ({ isOpen, onClose, currentEx, onSwap }) => {
  // console.log("SwapModal Render:", { isOpen, currentEx });
  if (!isOpen || !currentEx) return null;

  // Filter for similar exercises (Same Pattern & Sub-Pattern)
  // Also filter out the current exercise itself
  const alternatives = EXERCISE_LIBRARY.filter(e =>
    e.pattern === currentEx.pattern &&
    e.sub_pattern === currentEx.sub_pattern &&
    e.name !== currentEx.name
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-6 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Swap Exercise</h3>
            <p className="text-xs text-slate-500">Replacing <span className="font-semibold">{currentEx.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {alternatives.length > 0 ? (
            alternatives.map(img => (
              <button
                key={img.id}
                onClick={() => onSwap(img)}
                className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">{img.name}</span>
                    <span className="text-[10px] text-slate-400">{img.equipment || "No Equipment"}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${img.level === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                    img.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
                    }`}>{img.level}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              <MdFitnessCenter className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No direct alternatives found for this specific movement pattern ({currentEx.pattern} / {currentEx.sub_pattern}).</p>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>,
    document.body
  );
};

export const ExerciseRow = ({ ex, onSwapClick }) => {
  // 1. Get Timing Data (Plan or Fallback)
  const timing = ex.timing || EXERCISE_LIBRARY.find(e => e.name === ex.name)?.timing || { seconds_per_rep: 3 };

  // 2. Calculate Duration
  let durationLabel = "";
  if (ex.target && ex.target.toLowerCase().includes("sec")) {
    durationLabel = ex.target; // Already time based
  } else {
    // Extract reps
    const reps = parseInt(String(ex.target).replace(/[^0-9]/g, '')) || 10;
    const totalSeconds = Math.ceil(reps * timing.seconds_per_rep);

    // Format nicely (e.g. 90s vs 1m 30s? Let's stick to seconds for now or simple min parsing if large)
    if (totalSeconds > 60) {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      durationLabel = `${m}m ${s}s`;
    } else {
      durationLabel = `${totalSeconds}s`;
    }
  }

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " exercise tutorial")}`;

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* Swap Button (Left) */}
      {/* Swap Button (Left) */}
      {onSwapClick && (
        <button
          onClick={onSwapClick}
          className="text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded-lg transition-colors"
          title="Swap Exercise"
        >
          <MdSwapHoriz className="h-5 w-5" />
        </button>
      )}

      {/* Visual Placeholder (Image) */}
      <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 text-slate-400">
        <MdFitnessCenter className="h-6 w-6 opacity-50" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">
            {ex.name}
          </h4>

          {/* Level Badge - Hydrated on fly if missing */}
          {(() => {
            const libEx = EXERCISE_LIBRARY.find(e => e.name === ex.name);
            const level = ex.level || libEx?.level;
            if (!level) return null;

            const colors = {
              Beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              Intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              Advanced: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              Expert: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            };

            return (
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${colors[level] || "bg-slate-100 text-slate-500"}`}>
                {level}
              </span>
            );
          })()}

          {/* Duration Badge */}
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <MdAccessTime className="w-3 h-3" />
            {durationLabel}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {ex.target || "10-12 reps"}
        </p>
      </div>

      {/* Tutorial Link (Right) */}
      <a
        href={youtubeSearchUrl}
        target="_blank"
        rel="noreferrer"
        className="text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors"
        title="Watch Tutorial"
      >
        <MdPlayCircle className="h-6 w-6" />
      </a>
    </div>
  );
};

export const DayDetailCard = ({ d }) => {
  const navigate = useNavigate();
  const { swapExercise, inputs } = useUser();
  const [swapState, setSwapState] = React.useState({ isOpen: false, day: null, blockIdx: null, oldEx: null });

  const handleSwapClick = (blockIdx, ex) => {
    // Hydrate the exercise with full metadata from the library to ensure pattern/sub_pattern exist
    const fullEx = EXERCISE_LIBRARY.find(e => e.name === ex.name) || ex;
    console.log("Swap Clicked:", blockIdx, fullEx);
    setSwapState({
      isOpen: true,
      day: d.day,
      blockIdx,
      oldEx: fullEx
    });
  };

  const performSwap = (newEx) => {
    swapExercise(swapState.day, swapState.blockIdx, swapState.oldEx.name, newEx);
    setSwapState(prev => ({ ...prev, isOpen: false }));
  };

  // Calculate total exercises
  const totalExercises = d.rawBlocks.reduce((acc, block) => {
    return acc + (block.exercises ? block.exercises.length : 0);
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <SwapModal
        isOpen={swapState.isOpen}
        onClose={() => setSwapState(prev => ({ ...prev, isOpen: false }))}
        currentEx={swapState.oldEx}
        onSwap={performSwap}
      />

      {/* Navbarish Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 dark:border-slate-800">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MdChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{d.day} Workout</h1>
          {inputs?.fitnessLevel && (
            <span className={`text-[10px] font-bold uppercase tracking-wider ${inputs.fitnessLevel === 'Beginner' ? 'text-emerald-500' :
              inputs.fitnessLevel === 'Intermediate' ? 'text-blue-500' :
                'text-amber-500'
              }`}>
              {inputs.fitnessLevel} Plan
            </span>
          )}
        </div>
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
          {/* Removed Edit button */}
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
                            onSwapClick={() => handleSwapClick(i, ex)}
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
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40">
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
