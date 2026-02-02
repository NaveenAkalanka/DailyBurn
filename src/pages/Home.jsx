import React, { useState, useEffect } from "react";
import { MdCheckCircle, MdSettings, MdBolt, MdWhatshot, MdRefresh, MdChevronRight, MdCalendarToday, MdMonitorHeart, MdFitnessCenter, MdWarning, MdLock } from "react-icons/md";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { useHistory } from "../context/HistoryContext.jsx";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components/ui.jsx";
import { isSameDay } from "date-fns";

const ICONS = {
  Zap: <MdBolt className="h-5 w-5" />,
  Flame: <MdWhatshot className="h-5 w-5" />,
  RefreshCcw: <MdRefresh className="h-5 w-5" />,
  Activity: <MdMonitorHeart className="h-5 w-5" />
};

const FeaturedCard = ({ d, to, isCompleted }) => (
  <div className={`relative overflow-hidden rounded-3xl ${isCompleted ? 'bg-emerald-900' : 'bg-slate-900'} text-white shadow-xl shadow-slate-300/40 dark:shadow-none dark:border dark:border-slate-800 mb-8 active:scale-[0.99] transition-transform duration-300`}>
    <div className={`absolute top-0 right-0 p-32 md:p-40 rounded-full blur-3xl opacity-30 ${d.color.replace('ring-', 'bg-')}`}></div>
    <div className="relative p-6 sm:p-8 flex flex-col h-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider border border-white/10">
          {d.systemFocus || "Balanced"}
        </span>
        <div className={`p-2 rounded-xl bg-white/10 ${d.color.replace('ring-', 'text-')}`}>
          {ICONS[d.iconName]}
        </div>
      </div>

      <h3 className="text-3xl font-black tracking-tight mb-2">{d.day}</h3>
      <p className="text-slate-300 font-medium text-sm mb-6 max-w-xs">{d.type}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {d.rawBlocks.slice(0, 4).map((b, i) => (
          <span key={i} className="px-2.5 py-1 rounded-md bg-white/10 border border-white/5 text-[10px] uppercase font-bold text-slate-200">
            {b.name}
          </span>
        ))}
      </div>

      {isCompleted ? (
        <div className="w-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-100 font-black h-12 flex items-center justify-center gap-2 rounded-xl text-base shadow-lg cursor-default">
          <MdCheckCircle className="h-5 w-5 text-emerald-400" /> Session Completed
        </div>
      ) : (
        <Button as={Link} to={to} className="w-full bg-white !text-slate-900 hover:bg-slate-50 border-none font-black h-12 text-base shadow-lg shadow-black/20">
          Start Session <MdChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
);

const CompactDayRow = ({ d, to }) => (
  <Link to={to} className="flex items-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors group">
    <div className={`flex items-center justify-center h-12 w-12 rounded-2xl ${d.color.replace('ring-', 'bg-')} ${d.color.replace('ring-', 'text-')} bg-opacity-10 dark:bg-opacity-20 mr-4 shadow-sm`}>
      {ICONS[d.iconName]}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{d.day}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate flex gap-2">
        <span>{d.type}</span>
        {d.systemFocus && <span className="font-bold text-slate-400">• {d.systemFocus}</span>}
      </p>
    </div>
    <div className="flex items-center text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors">
      <MdChevronRight className="h-5 w-5" />
    </div>
  </Link>
);

const PlanHeader = ({ plan, inputs }) => {
  const daysPerWeek = plan.length;
  const level = inputs.fitnessLevel;
  const mode = inputs.time <= 30 ? "Circuit" : "Superset";

  // Calculate System Distribution
  const systems = plan.reduce((acc, day) => {
    const sys = day.systemFocus || "Balanced";
    acc[sys] = (acc[sys] || 0) + 1;
    return acc;
  }, {});

  const isMixed = Object.keys(systems).length > 1;

  return (
    <div className="mb-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Current Cycle</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {daysPerWeek} Days • {level} • {mode}
            </p>
          </div>
          <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <MdCalendarToday className="h-5 w-5 text-slate-900 dark:text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>System Focus</span>
            <span>{isMixed ? "Mixed" : "Single"}</span>
          </div>

          <div className="flex gap-2">
            {Object.entries(systems).map(([sys, count]) => (
              <div key={sys} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700">
                <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ${sys.includes("Power") ? "text-yellow-600 dark:text-yellow-400" :
                  sys.includes("Metabolic") ? "text-orange-600 dark:text-orange-400" :
                    "text-blue-600 dark:text-blue-400"
                  }`}>{sys.split(" ")[0]}</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{count}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { currentPlan, resetInputs, inputs } = useUser();
  const { history, clearHistory } = useHistory();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isInteractionSafe, setIsInteractionSafe] = useState(false);

  // Scroll to top on mount to ensure clean state
  useEffect(() => {
    window.scrollTo(0, 0);
    // Add a safety buffer where the reset dialog cannot be triggered
    // This prevents ghost clicks from the "Generate" button matching the position of "Remake"
    const timer = setTimeout(() => setIsInteractionSafe(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!inputs || currentPlan.length === 0) return null;

  // Real-time Day Matching
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayPlan = currentPlan.find(d => d.day === todayName);

  // LOGIC: If today has a plan, show it. If not, find the next available plan.
  // Since plans are sorted M-F (or by user selection), we need to find the next one in the cycle.
  // Actually, 'currentPlan' is just the array of selected days in order. 
  // We need to find the first day that comes AFTER today.

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = daysOfWeek.indexOf(todayName);

  // Find next workout day
  // Sort currentPlan first to be safe (though usually it is)
  const sortedPlan = [...currentPlan].sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day));

  let nextPlan = sortedPlan.find(d => daysOfWeek.indexOf(d.day) > todayIndex);

  // If no workout later this week, wrap around to the first workout of the week
  if (!nextPlan && sortedPlan.length > 0) {
    nextPlan = sortedPlan[0];
  }

  // Determine what to display as "Featured"
  const isRestDay = !todayPlan;
  const displayDay = todayPlan || nextPlan;

  // List: Show all OTHER days (excluding the one displayed as featured)
  const upcomingDays = sortedPlan.filter(d => d.day !== displayDay.day);

  // Check if the Featured Day is completed
  const isFeaturedCompleted = history.some(entry =>
    entry.dayName === displayDay.day && isSameDay(new Date(entry.completedAt), new Date())
  );

  // --- MISSED WORKOUT LOGIC ---
  // Find any scheduled day BEFORE today that is NOT in history
  // Note: This logic resets every week (Sunday-Saturday cycle)
  let missedPlan = null;
  for (let i = 0; i < todayIndex; i++) {
    const dayNameToCheck = daysOfWeek[i];
    // Is this day in the plan?
    const planDay = currentPlan.find(d => d.day === dayNameToCheck);
    if (planDay) {
      // Did we do it?
      // Check history for THIS week's instance of that day
      // Simplification: Check if we have a log for this DayName that happened *this week*
      // Actually, precise date checking is better if strict, but 'dayName' check matches existing structure
      // Let's assume history.some(e => e.dayName === planDay.day && isCompletedInCurrentInterval(e.completedAt))

      // Better: Check if history has an entry for 'dayNameToCheck' with timestamp > StartOfWeek
      // We need startOfWeek.
      const startOfCurrentWeek = new Date();
      const dayDiff = todayIndex - i; // How many days ago?
      // If today is Tuesday (2), Monday (1) was 1 day ago.
      // Rough approximation for "this week" missed

      // Let's rely on the user's request: "if user skiped sunday he shoud able to do it on monday"
      // We check if (Day is Scheduled) AND (No history entry for that DayName recently).
      // "Recently" = since the last cycle reset? 
      // Let's simple check: Is there a history entry for `planDay.day` dated in the last 6 days?
      // If not -> It's missed.

      const hasRecentLog = history.some(entry => {
        if (entry.dayName !== planDay.day) return false;
        const entryDate = new Date(entry.completedAt);
        const diffTime = Math.abs(new Date() - entryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 7;
      });

      if (!hasRecentLog) {
        missedPlan = planDay;
        break; // Found the earliest missed day
      }
    }
  }

  const activeDisplayDay = missedPlan || displayDay;
  const isMissedState = !!missedPlan;

  return (
    <div className="pb-12 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
      {/* Plan Details Header */}
      <PlanHeader plan={currentPlan} inputs={inputs} />

      {/* Featured Card */}
      <div className="animate-slideUpFade animation-delay-100 mb-8">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {isMissedState ? (
              <span className="text-rose-500 font-bold flex items-center gap-1">
                <MdWarning className="h-5 w-5" /> Missed Session
              </span>
            ) : isRestDay ? (
              <>
                Rest & Recovery <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Up Next: {displayDay.day}</span>
              </>
            ) : (
              <>
                {isFeaturedCompleted ? "Session Complete" : "Today's Focus"} <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{todayName}</span>
              </>
            )}
          </h3>

          {isMissedState && (
            <button
              onClick={() => {
                // "Skip & Do Today" implies ignoring the missed one for UI purposes
                // We can't really "skip" permanently without persistence, but for now we can just display Today's card if user ignores.
                // Actually, simpler to just start today's workout directly from the list below if they want to skip.
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase"
            >
              {/* Visual label only, user can pick from list down below to 'skip' */}
              Catch Up Required
            </button>
          )}
        </div>

        {/* Render Card: Missed gets RED styling */}
        <div className={isMissedState ? "ring-4 ring-rose-500/30 rounded-3xl" : ""}>
          <FeaturedCard
            d={activeDisplayDay}
            to={`/day/${activeDisplayDay.day.replace(" ", "").toLowerCase()}`}
            isCompleted={!isMissedState && isFeaturedCompleted} // Only today can be 'completed' effectively in this view
          />
        </div>

        {isMissedState && (
          <div className="text-center mt-2">
            <p className="text-xs text-slate-500 mb-2">or skip and continue schedule</p>
            <Button as={Link} to={`/day/${displayDay.day.replace(" ", "").toLowerCase()}`} variant="outline" className="h-10 text-xs font-bold border-slate-200 dark:border-slate-800">
              Skip to {displayDay.day}
            </Button>
          </div>
        )}
      </div>

      {/* Full Schedule List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your Schedule</h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{upcomingDays.length} Sessions</span>
        </div>

        <div className="flex flex-col gap-3">
          {upcomingDays.map((d) => (
            <CompactDayRow key={d.day} d={d} to={`/day/${d.day.replace(" ", "").toLowerCase()}`} />
          ))}
        </div>

        <div className="pt-8 pb-4">
          <Button
            onClick={() => {
              if (isInteractionSafe) {
                setIsResetDialogOpen(true);
              }
            }}
            variant="outline"
            className={`w-full border-2 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:border-red-900 dark:hover:text-red-400 transition-all h-14 text-sm uppercase tracking-widest font-black ${!isInteractionSafe ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <MdLock className="mr-2 h-4 w-4" /> Remake Workout Plan
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isResetDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdWarning className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Remake Your Plan?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                This will <strong>permanently delete</strong> your current schedule and progress. You'll go back to the setup screen.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsResetDialogOpen(false)}
                  className="h-12 font-bold border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsResetDialogOpen(false);
                    localStorage.removeItem('dailyburn_active_session'); // Clear paused sessions
                    clearHistory(); // Clear workout history
                    resetInputs(); // Clear plan
                  }}
                  className="h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30"
                >
                  Yes, Remake It
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
