// src/components/ui.jsx
import React from "react";

export const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

export const Card = ({ children, className = "", ...props }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`flex items-start justify-between gap-4 p-5 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-bold leading-tight text-slate-900 dark:text-white ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-5 pt-0 ${className}`}>{children}</div>
);

export const Button = ({
  children,
  className = "",
  onClick,
  variant = "default",
  type = "button",
  as: As = "button",
  to,
  href,
}) => {
  const base =
    "inline-flex items-center justify-center text-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition active:scale-[.98]";
  const styles = {
    default: "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-slate-200",
    outline: "border border-gray-300 hover:border-gray-400 dark:border-slate-700 dark:hover:border-slate-600 dark:text-slate-300",
    soft: "bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    green: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500",
    red: "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500",
  };
  const cls = `${base} ${styles[variant]} ${className}`;
  return (
    <As to={to} href={href} onClick={onClick} type={type} className={cls}>
      {children}
    </As>
  );
};

export const ProgressBar = ({ value }) => (
  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
    <div
      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export const Slider = ({ value, min, max, step = 1, onChange, className = "", color = "indigo", gradient = null, getSegmentColor = null }) => {
  const colorStyles = {
    indigo: "accent-indigo-600 dark:accent-indigo-500 hover:accent-indigo-700",
    amber: "accent-amber-500 dark:accent-amber-500 hover:accent-amber-600",
    emerald: "accent-emerald-600 dark:accent-emerald-500 hover:accent-emerald-700",
    rose: "accent-rose-600 dark:accent-rose-500 hover:accent-rose-700",
  };
  const accentClass = colorStyles[color] || colorStyles.indigo;

  // Segment generation
  const segments = [];
  if (getSegmentColor) {
    for (let i = min; i < max; i += step) {
      segments.push(i);
    }
    // Add the final segment or ensure the range covers it correctly
    // If range is 5-120, steps of 5. 5, 10, ... 115. (23 items). 
    // Usually segments are intervals. 5-10, 10-15.
    // Let's treat each 'step' as a block.
  }

  return (
    <div className={`relative flex items-center w-full h-8 ${className}`}>
      {/* Visual Track (Segments) */}
      {getSegmentColor && (
        <div className="absolute inset-0 flex items-center justify-between gap-0.5 px-0.5 pointer-events-none">
          {segments.map((val) => (
            <div
              key={val}
              className={`h-2 flex-grow rounded-sm transition-colors ${getSegmentColor(val)}`}
            />
          ))}
        </div>
      )}

      {/* Actual Input Trigger */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={gradient && !getSegmentColor ? { background: gradient } : { background: 'transparent' }}
        className={`relative w-full h-8 bg-transparent rounded-lg appearance-none cursor-pointer z-10 ${accentClass} ${getSegmentColor ? "" : (!gradient ? "bg-slate-200 dark:bg-slate-700" : "")}`}
      />

      {/* Custom Thumb Styling override might be needed if standard accent doesn't work well with transparent bg, strictly standard accent works fine usually. */}
    </div>
  );
};

export const SegmentedSlider = ({ value, min, max, step, onChange, getColorForValue, className = "" }) => {
  // Generate segments
  const segments = [];
  for (let i = min; i <= max; i += step) {
    segments.push(i);
  }

  // Handle Drag
  const handleInteraction = (e) => {
    // Basic interaction handling logic would go here, but for simplicity in this artifact, 
    // we'll stick to a click-based implementation first or a simple range input overlay.
    // Actually, a click-based interaction for each segment is cleaner for this specific UI "blocks" look.
    // However, to support dragging, we might overlay a transparent range input or handle pointer events.

    // Let's implement click-to-select specific segments for now.
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between gap-1 w-full h-12 relative touch-none select-none">
        {segments.map((val) => {
          const colorClass = getColorForValue(val); // expect "bg-amber-500", etc.
          const isSelected = value >= val; // Fill up to current value? Or just show the specific single block?
          // Request was "slider should be like this" -> showing a full bar of colored segments.
          // Usually these bars are static colored maps, and a pointer moves on them.

          return (
            <div
              key={val}
              onClick={() => onChange(val)}
              className={`flex-1 rounded-sm cursor-pointer transition-all hover:scale-110 relative group ${colorClass}`}
              title={`${val} min`}
            >
              {/* Tooltip on hover */}
            </div>
          );
        })}

        {/* Pointer */}
        {/* We need to calculate position. Since we use flex-1, correct positioning is percentages. */}
        <div
          className="absolute -bottom-3 w-4 h-4 bg-slate-900 rotate-45 transform -translate-x-1/2 transition-all duration-300 border-2 border-white pointer-events-none"
          style={{
            left: `${((value - min) / (max - min)) * 100}%`
          }}
        />
      </div>
    </div>
  );
};
