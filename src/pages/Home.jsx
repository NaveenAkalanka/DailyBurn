// src/pages/Home.jsx
import React from "react";
import { CheckCircle2, Settings, Zap, Flame, RefreshCcw, ChevronRight, Calendar, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components/ui.jsx";

const ICONS = {
  Zap: <Zap className="h-5 w-5" />,
  Flame: <Flame className="h-5 w-5" />,
  RefreshCcw: <RefreshCcw className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />
};

const FeaturedCard = ({ d, to }) => (
  <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-300/40 dark:shadow-none mb-8 active:scale-[0.99] transition-transform duration-300">
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

      <Button as={Link} to={to} className="w-full bg-white !text-slate-900 hover:bg-slate-50 border-none font-black h-12 text-base shadow-lg shadow-black/20">
        Start Session <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
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
      <ChevronRight className="h-5 w-5" />
    </div>
  </Link>
);

export default function Home() {
  const { currentPlan, resetInputs, inputs } = useUser();

  if (!inputs || currentPlan.length === 0) return null;

  // Separate the first day as "Featured" and the rest as "Upcoming"
  const [featuredDay, ...upcomingDays] = currentPlan;

  return (
    <div className="pb-12 pt-2">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between mb-6 px-1">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        </div>
        <button
          onClick={resetInputs}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-slate-200 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* Featured "Up Next" Workout */}
      <div className="animate-slideUpFade">
        <FeaturedCard d={featuredDay} to={`/day/${featuredDay.day.replace(" ", "").toLowerCase()}`} />
      </div>

      {/* Upcoming List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Upcoming Sessions</h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{upcomingDays.length}</span>
        </div>

        <div className="flex flex-col gap-3">
          {upcomingDays.map((d) => (
            <CompactDayRow key={d.day} d={d} to={`/day/${d.day.replace(" ", "").toLowerCase()}`} />
          ))}
        </div>
      </div>

    </div>
  );
}
