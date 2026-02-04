import React, { useState, useEffect } from "react";
import { MdCheck, MdDateRange, MdTimer, MdCancel, MdChevronRight, MdChevronLeft, MdBolt, MdMonitorHeart, MdWhatshot, MdDashboard, MdFitnessCenter, MdWarning, MdCheckCircle, MdScience, MdSecurity, MdLoop, MdTrendingUp, MdWeekend, MdBackHand, MdVerticalSplit, MdHealing, MdDirectionsRun, MdAccessibilityNew } from "react-icons/md";
import { useUser } from "../context/UserContext";
import { predictSchedule, getDurationGuidelines } from "../logic/scienceAlgorithm";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Slider, SegmentedSlider } from "./ui";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SLIDES = [
    {
        id: "intro",
        title: "Democratizing Sports Science",
        content: (
            <div className="space-y-4 text-center">
                <img src="/DailyBurn.svg" alt="Logo" className="w-24 h-24 mx-auto mb-4 dark:brightness-0 dark:invert" />
                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    Elite-level Calisthenics & Conditioning, simplified.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    We take complex concepts like <strong>Periodization</strong> & <strong>Biomechanics</strong> and handle the math for you. You just handle the sweat.
                </p>
            </div>
        )
    },
    {
        id: "no_ai",
        title: "Math & Science > AI",
        icon: <MdScience className="w-12 h-12 text-blue-500 mx-auto mb-4" />,
        content: (
            <div className="space-y-4 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                    Most "AI" workout apps are just hallucinations.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                    <strong>DailyBurn is different.</strong> We use proven physiological algorithms and real-world math to ensure your safety and progression.
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-4">
                    "Zero-Excuses" Philosophy: We adapt to your time, equipment, and energy.
                </p>
            </div>
        )
    },
    {
        id: "systems_intro",
        title: "The 3 Fuel Tanks",
        icon: <div className="flex justify-center gap-2 mb-4">
            <MdBolt className="w-8 h-8 text-yellow-500" />
            <MdWhatshot className="w-8 h-8 text-orange-500" />
            <MdMonitorHeart className="w-8 h-8 text-green-500" />
        </div>,
        content: (
            <div className="space-y-4 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                    Your body isn't just one engine. It has <strong>3 distinct Energy Systems</strong>.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    Most apps just "burn calories". We specifically target each tank to build a complete athlete: <strong>Power, Stamina, and Endurance.</strong>
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    Let's meet your engines...
                </p>
            </div>
        )
    },
    {
        id: "system1",
        title: "System 1: Phosphagen",
        icon: <MdBolt className="w-12 h-12 text-yellow-500 mx-auto mb-4" />,
        content: (
            <div className="space-y-4 text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Explosive Power</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Short, intense bursts of effort (1-10 seconds). Think heavy lifting or sprinting.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    This system fuels your max effort lifts and plyometrics.
                </p>
            </div>
        )
    },
    {
        id: "system2",
        title: "System 2: Glycolytic",
        icon: <MdWhatshot className="w-12 h-12 text-orange-500 mx-auto mb-4" />,
        content: (
            <div className="space-y-4 text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">High Intensity</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Moderate duration (30s - 2 mins). The "burn" you feel during hard sets.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    Essential for building muscle endurance and hypertrophy.
                </p>
            </div>
        )
    },
    {
        id: "system3",
        title: "System 3: Oxidative",
        icon: <MdMonitorHeart className="w-12 h-12 text-green-500 mx-auto mb-4" />,
        content: (
            <div className="space-y-4 text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Endurance</h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Long duration, steady state. Keeps you going for the long haul.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    Improves recovery and overall cardiovascular health.
                </p>
            </div>
        )
    },

    {
        id: "method_selection",
        title: "Choose Your Path",
        icon: <MdDashboard className="w-8 h-8 text-indigo-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "algorithm_explainer",
        title: "The Science Engine",
        icon: <MdBolt className="w-8 h-8 text-amber-500 mx-auto mb-2" />,
        content: (
            <div className="space-y-4 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                    Our <strong>Metabolic Sculptor</strong> algorithm uses <strong>Undulating Periodization</strong>.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-sm text-left space-y-2 border border-slate-200 dark:border-slate-700">
                    <p className="flex items-center gap-2"><MdScience className="w-5 h-5 text-purple-500 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>Mixes Intensity:</strong> Alternates between strength, power, and recovery to prevent burnout.</span></p>
                    <p className="flex items-center gap-2"><MdWhatshot className="w-5 h-5 text-orange-500 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>Fat Loss:</strong> Optimizes rest periods to maximize the "Afterburn" effect (EPOC).</span></p>
                    <p className="flex items-center gap-2"><MdSecurity className="w-5 h-5 text-blue-500 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>Safety:</strong> Adjusts volume based on your equipment and capability limits.</span></p>
                </div>
            </div>
        )
    },
    {
        id: "config_days",
        title: "Your Schedule",
        icon: <MdDateRange className="w-8 h-8 text-blue-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "config_level",
        title: "Experience Level",
        icon: <MdMonitorHeart className="w-8 h-8 text-purple-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "config_time",
        title: "Session Duration",
        icon: <MdTimer className="w-8 h-8 text-emerald-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "mode_explanation",
        title: "Your Training Mode",
        icon: <MdBolt className="w-8 h-8 text-indigo-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "config_limits",
        title: "Limitations",
        icon: <MdCancel className="w-8 h-8 text-amber-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "custom_placeholder",
        title: "Custom Builder",
        content: (
            <div className="text-center space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                        <MdMonitorHeart className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Coming Soon!</h3>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Our Custom Plan Builder is under construction.
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                        For now, please use the Auto-Generator to create a scientifically optimized plan tailored to your needs.
                    </p>
                </div>
            </div>
        )
    }
];

export default function Onboarding() {
    const { updateInputs } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    // Auto-set default time when entering the time configuration slide


    // PERSISTENCE: Initialize from storage or default to 0
    const [currentSlide, setCurrentSlide] = useState(() => {
        const saved = localStorage.getItem('dailyburn_onboarding_slide');
        return saved ? parseInt(saved, 10) : 0;
    });

    // Form State
    const [fitnessLevel, setFitnessLevel] = useState("Intermediate"); // Default
    const [selectedDays, setSelectedDays] = useState(["Monday", "Wednesday", "Friday"]);
    const [time, setTime] = useState(30);
    const [exclusions, setExclusions] = useState([]);
    const [planMethod, setPlanMethod] = useState(null); // 'auto' | 'custom'
    const [showAdvisor, setShowAdvisor] = useState(false);

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('dailyburn_onboarding_slide', currentSlide.toString());
        console.log("Onboarding Slide Updated:", currentSlide, SLIDES[currentSlide]?.id);
    }, [currentSlide]);

    const toggleDay = (day) => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            } else {
                const newDays = [...prev, day];
                return newDays.sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
            }
        });
    };

    const toggleExclusion = (val) => {
        setExclusions(prev =>
            prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
        );
    };

    const handleGenerate = () => {
        if (selectedDays.length === 0) return;

        setIsGenerating(true);

        // Add significant delay to allow the "Building Plan..." UI to show
        // and completely prevent any ghost clicks or immediate interactions
        setTimeout(() => {
            localStorage.removeItem('dailyburn_onboarding_slide'); // Clear persistence
            updateInputs({ selectedDays, time, exclusions, fitnessLevel });
        }, 800);
    };

    // Smart Advisor Logic
    useEffect(() => {
        if (selectedDays.length >= 6 && time >= 40) {
            setShowAdvisor(true);
        } else {
            setShowAdvisor(false);
        }
    }, [selectedDays, time]);

    const nextSlide = () => {
        const slideIdx = currentSlide;
        const slideId = SLIDES[slideIdx].id;

        // Branching Logic
        if (slideId === "method_selection") {
            if (planMethod === "auto") {
                // Go to explainer first
                const explainerIdx = SLIDES.findIndex(s => s.id === "algorithm_explainer");
                setCurrentSlide(explainerIdx);
            } else if (planMethod === "custom") {
                // Jump to custom_placeholder (last slide)
                const customIdx = SLIDES.findIndex(s => s.id === "custom_placeholder");
                setCurrentSlide(customIdx);
            }
            return;
        }

        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            const currentId = SLIDES[currentSlide].id;
            // If we are at custom_placeholder, go back to method_selection
            if (currentId === "custom_placeholder") {
                const methodIdx = SLIDES.findIndex(s => s.id === "method_selection");
                setCurrentSlide(methodIdx);
                return;
            }
            // If we are at algorithm_explainer, go back to method_selection
            if (currentId === "algorithm_explainer") {
                const methodIdx = SLIDES.findIndex(s => s.id === "method_selection");
                setCurrentSlide(methodIdx);
                return;
            }

            setCurrentSlide(prev => prev - 1);
        }
    };

    const quickStart = () => {
        // Skip setup usually implies skipping to the end or defaults?
        // Actually the original code just jumped to method_selection.
        // We should probably NOT clear storage here if it's just jumping to slide 4.
        const idx = SLIDES.findIndex(s => s.id === "method_selection");
        setCurrentSlide(idx);
    };

    const slide = SLIDES[currentSlide];

    // Auto-set default time when entering the time configuration slide
    useEffect(() => {
        if (slide && slide.id === "config_time") {
            const { ideal } = getDurationGuidelines(fitnessLevel, selectedDays.length);
            setTime(ideal);
        }
    }, [slide?.id, fitnessLevel, selectedDays.length]); // Depend on slide.id safely

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/95 dark:bg-slate-950/95 p-4 backdrop-blur-sm overflow-y-auto safe-area-padding transition-colors duration-300">
            <Card className="w-full max-w-lg shadow-2xl ring-1 ring-slate-200 my-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
                <CardHeader className="text-center pb-2 pt-6">
                    {slide.icon && <div className="flex justify-center mb-2">{slide.icon}</div>}
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{slide.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 p-6">

                    {/* Educational Content & Custom Placeholder */}
                    {(slide.content && slide.id !== "method_selection") && (
                        <div className="min-h-[200px] flex flex-col justify-center">
                            {slide.content}
                        </div>
                    )}

                    {/* Method Selection */}
                    {slide.id === "method_selection" && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <button
                                onClick={() => setPlanMethod("auto")}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${planMethod === "auto"
                                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20 dark:bg-blue-900/20 dark:border-blue-500"
                                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shadow-sm dark:bg-blue-900/30 dark:text-blue-400">
                                        <MdBolt className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white">Auto-Generate Plan</h4>
                                        <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                                            Answer 3 quick questions and get a science-based plan instantly.
                                        </p>
                                    </div>
                                    {planMethod === "auto" && <div className="bg-blue-600 rounded-full p-1"><MdCheck className="h-4 w-4 text-white" /></div>}
                                </div>
                            </button>

                            <button
                                onClick={() => setPlanMethod("custom")}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${planMethod === "custom"
                                    ? "border-purple-600 bg-purple-50/50 ring-1 ring-purple-600/20 dark:bg-purple-900/20 dark:border-purple-500"
                                    : "border-slate-200 hover:border-purple-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg shadow-sm dark:bg-purple-900/30 dark:text-purple-400">
                                        <MdMonitorHeart className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white">Build From Scratch</h4>
                                        <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                                            Manually select exercises and build your own routine piece by piece.
                                        </p>
                                    </div>
                                    {planMethod === "custom" && <div className="bg-purple-600 rounded-full p-1"><MdCheck className="h-4 w-4 text-white" /></div>}
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Step 1: Days */}
                    {slide.id === "config_days" && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Weekly Schedule</span>
                                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    {selectedDays.length} / 7 Selected
                                </Badge>
                            </div>

                            {/* Legend */}
                            {selectedDays.length >= 2 && (
                                <div className="flex justify-center gap-4 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                    {true && (
                                        <>
                                            <div className="flex items-center gap-1"><MdBolt className="w-3 h-3 text-yellow-500" /> Power</div>
                                            <div className="flex items-center gap-1"><MdWhatshot className="w-3 h-3 text-orange-500" /> Burn</div>
                                            <div className="flex items-center gap-1"><MdMonitorHeart className="w-3 h-3 text-green-500" /> Endurance</div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {WEEKDAYS.map((day) => {
                                    const isSelected = selectedDays.includes(day);

                                    // Determine Icon based on Prediction
                                    let Icon = MdCheck;
                                    let iconColor = "text-white";

                                    if (isSelected) {
                                        // Use the actual algorithm prediction
                                        const schedule = predictSchedule(selectedDays);
                                        const prediction = schedule[day];

                                        if (prediction?.iconType === "Zap") {
                                            Icon = MdBolt;
                                            iconColor = "text-yellow-200";
                                        } else if (prediction?.iconType === "Flame") {
                                            Icon = MdWhatshot;
                                            iconColor = "text-orange-200";
                                        } else if (prediction?.iconType === "Activity") {
                                            Icon = MdMonitorHeart;
                                            iconColor = "text-green-200";
                                        }
                                    }

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => toggleDay(day)}
                                            className={`
                                                relative flex flex-col items-center justify-center h-14 rounded-xl text-xs font-semibold
                                                transition-all duration-200 border select-none active:scale-95
                                                ${isSelected
                                                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                                }
                                            `}
                                        >
                                            <span>{day.substring(0, 3)}</span>
                                            {isSelected && (
                                                <div className={`absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 shadow-sm border-2 border-white`}>
                                                    <Icon className={`h-3 w-3 ${iconColor}`} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedDays.length === 0 && (
                                <p className="text-xs text-rose-500 font-medium animate-pulse text-center">Please select at least one day.</p>
                            )}
                        </div>
                    )}

                    {/* Step 2: Time */}
                    {slide.id === "config_time" && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">

                            {/* Logic for Feedback */}
                            {(() => {
                                const daysCount = selectedDays.length;
                                // Recommendation Engine
                                const { min: minRec, max: maxRec } = getDurationGuidelines(fitnessLevel, daysCount);

                                let message = "Optimal duration based on your level.";
                                let type = "neutral"; // neutral, success, warning, danger
                                let sliderColor = "indigo"; // Default
                                let slogan = "Conquer Gravity.";

                                if (time < minRec) {
                                    // UNDER ZONE -> AMBER
                                    message = `Good start! Push to ${minRec} min to unlock real gains.`;
                                    type = "warning"; // Reusing warning type for "Under" visualization (Amber)
                                    slogan = "Find Your Fire.";
                                    sliderColor = "amber";
                                } else if (time > maxRec) {
                                    // OVER ZONE -> ROSE
                                    message = "High Volume. Ensure you prioritize recovery.";
                                    type = "danger";
                                    slogan = "Listen To Your Body.";
                                    sliderColor = "rose";
                                } else {
                                    // OPTIMAL ZONE -> EMERALD
                                    message = "Perfect Sweet Spot. Maximum efficiency.";
                                    type = "success";
                                    slogan = "Conquer Gravity.";
                                    sliderColor = "emerald";
                                }

                                // Extreme check
                                if (time >= 90 && daysCount >= 5) {
                                    message = "Elite Volume. Ensure you sleep & eat enough.";
                                    type = "danger";
                                }

                                return (
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <div className="text-6xl font-black text-slate-900 dark:text-white mb-2 tabular-nums tracking-tight">
                                                {time}<span className="text-xl text-slate-400 font-bold ml-2 tracking-normal">min</span>
                                            </div>
                                            <p className={`text-sm font-bold uppercase tracking-widest ${type === "danger" ? "text-rose-500" :
                                                type === "warning" ? "text-amber-500" : "text-emerald-500"
                                                }`}>
                                                {slogan}
                                            </p>
                                        </div>

                                        <div className="px-4">
                                            <div className="px-4">
                                                {/* Segmented Slider Logic */}
                                                {(() => {
                                                    const getSegmentColor = (val) => {
                                                        if (val < minRec) return "bg-amber-400";
                                                        if (val > maxRec) return "bg-rose-400";
                                                        return "bg-emerald-500";
                                                    };

                                                    return (
                                                        <Slider
                                                            min={5}
                                                            max={120}
                                                            step={5}
                                                            value={time}
                                                            onChange={(e) => setTime(parseInt(e.target.value))}
                                                            className="mb-8"
                                                            color={sliderColor}
                                                            getSegmentColor={getSegmentColor}
                                                        />
                                                    );
                                                })()}
                                                <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                                                    <span>5m</span>
                                                    <span className={time >= minRec && time <= maxRec ? "text-emerald-600" : ""}>Target: {minRec}-{maxRec}m</span>
                                                    <span>120m</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feedback Card */}
                                        <div className={`p-4 rounded-xl border text-sm flex gap-3 items-start transition-colors duration-300 ${type === "danger" ? "bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-900/20 dark:border-rose-900 dark:text-rose-300" :
                                            type === "warning" ? "bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900 dark:text-amber-300" :
                                                type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-900 dark:text-emerald-300" :
                                                    "bg-slate-50 border-slate-100 text-slate-600"
                                            }`}>
                                            {/* Icons */}
                                            <div className="shrink-0 mt-0.5">
                                                {type === "danger" && <MdWarning className="w-5 h-5" />}
                                                {type === "warning" && <MdWhatshot className="w-5 h-5" />}
                                                {type === "success" && <MdCheckCircle className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="font-bold mb-0.5">Coach's Insight</div>
                                                {message}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Step 2.5: Mode Explanation */}
                    {slide.id === "mode_explanation" && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 text-center">
                            {time <= 30 ? (
                                <>
                                    <div className="p-4 bg-orange-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center dark:bg-orange-900/20">
                                        <MdBolt className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Circuit Mode</h3>
                                        <p className="text-slate-500 font-medium mt-1 dark:text-slate-400">Short Duration • High Intensity</p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl text-sm text-left border border-orange-100 space-y-2 dark:bg-orange-900/20 dark:border-orange-900/50">
                                        <p className="flex items-center gap-2"><MdBolt className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>Fast Paced:</strong> Minimal rest between exercises to keep your heart rate up.</span></p>
                                        <p className="flex items-center gap-2"><MdLoop className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>4 Rounds:</strong> High volume in a short time window.</span></p>
                                        <p className="flex items-center gap-2"><MdWhatshot className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>Goal:</strong> Maximum calorie burn and conditioning.</span></p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-indigo-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center dark:bg-indigo-900/20">
                                        <MdFitnessCenter className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Superset Mode</h3>
                                        <p className="text-slate-500 font-medium mt-1 dark:text-slate-400">Standard Duration • Strength Focus</p>
                                    </div>
                                    <div className="bg-indigo-50 p-4 rounded-xl text-sm text-left border border-indigo-100 space-y-2 dark:bg-indigo-900/20 dark:border-indigo-900/50">
                                        <p className="flex items-center gap-2"><MdFitnessCenter className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>Strength First:</strong> Longer rest periods to maximize lift quality.</span></p>
                                        <p className="flex items-center gap-2"><MdLoop className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>3 Rounds:</strong> Focused volume for hypertrophy.</span></p>
                                        <p className="flex items-center gap-2"><MdTrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" /> <span className="text-slate-700 dark:text-slate-300"><strong>Goal:</strong> Build muscle and increase raw strength.</span></p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Limits */}
                    {slide.id === "config_limits" && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "no_bar", label: "No Pull-up Bar", caption: "Excludes Pull-ups", icon: MdFitnessCenter, color: "blue" },
                                    { id: "no_furniture", label: "No Furniture", caption: "Floor exercises only", icon: MdWeekend, color: "indigo" },
                                    { id: "no_wall", label: "No Wall Access", caption: "Excludes Wall Sits", icon: MdVerticalSplit, color: "slate" },
                                    { id: "wrist_pain", label: "Wrist Pain", caption: "No floor push-ups", icon: MdBackHand, color: "rose" },
                                    { id: "knee_pain", label: "Knee Pain", caption: "Low impact squats", icon: MdHealing, color: "rose" },
                                    { id: "no_jumping", label: "No Jumping", caption: "Quiet & low impact", icon: MdDirectionsRun, color: "emerald" }
                                ].map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = exclusions.includes(opt.id);

                                    // Dynamic Color Classes
                                    const colorClasses = {
                                        blue: isSelected ? "border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500/20 shadow-blue-500/10 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-500" : "group-hover:border-blue-200 group-hover:bg-blue-50/50 dark:group-hover:border-blue-800 dark:group-hover:bg-blue-900/20",
                                        indigo: isSelected ? "border-indigo-500 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500/20 shadow-indigo-500/10 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-500" : "group-hover:border-indigo-200 group-hover:bg-indigo-50/50 dark:group-hover:border-indigo-800 dark:group-hover:bg-indigo-900/20",
                                        slate: isSelected ? "border-slate-600 bg-slate-100 text-slate-900 ring-1 ring-slate-500/20 shadow-slate-500/10 dark:bg-slate-700 dark:text-white dark:border-slate-500" : "group-hover:border-slate-300 group-hover:bg-slate-50 dark:group-hover:border-slate-600 dark:group-hover:bg-slate-800",
                                        rose: isSelected ? "border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500/20 shadow-rose-500/10 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-500" : "group-hover:border-rose-200 group-hover:bg-rose-50/50 dark:group-hover:border-rose-800 dark:group-hover:bg-rose-900/20",
                                        emerald: isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-emerald-500/20 shadow-emerald-500/10 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-500" : "group-hover:border-emerald-200 group-hover:bg-emerald-50/50 dark:group-hover:border-emerald-800 dark:group-hover:bg-emerald-900/20",
                                    };

                                    const iconBgClasses = {
                                        blue: isSelected ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-600",
                                        indigo: isSelected ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-600",
                                        slate: isSelected ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600",
                                        rose: isSelected ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600",
                                        emerald: isSelected ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600",
                                    };

                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleExclusion(opt.id)}
                                            className={`
                                            group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 text-center gap-3 select-none active:scale-[0.98]
                                            ${isSelected
                                                    ? colorClasses[opt.color]
                                                    : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:shadow-md " + colorClasses[opt.color]
                                                }
                                        `}
                                        >
                                            <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300
                                            ${iconBgClasses[opt.color]}
                                        `}>
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            <div className="space-y-1">
                                                <span className="block font-bold text-sm leading-tight text-slate-900 dark:text-slate-100">{opt.label}</span>
                                                <span className={`block text-[10px] font-medium leading-tight ${isSelected ? 'opacity-100' : 'text-slate-400'} transition-opacity`}>
                                                    {opt.caption}
                                                </span>
                                            </div>

                                            {isSelected && (
                                                <div className={`absolute top-2 right-2 rounded-full p-1 shadow-sm animate-in zoom-in spin-in-90 duration-300 ${opt.color === 'slate' ? 'bg-slate-600' : `bg-${opt.color}-500`} text-white`}>
                                                    <MdCheck className="w-3 h-3" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center bg-slate-50 dark:bg-slate-800/50 py-3 px-4 rounded-xl mx-auto max-w-sm leading-relaxed">
                                Select any limitations to ensure we build the <strong>safest</strong> and most <strong>comfortable</strong> plan for your specific needs.
                            </p>
                        </div>
                    )}

                    {/* Step 1.5: Fitness Level */}
                    {slide.id === "config_level" && (
                        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => {
                                const levelColors = {
                                    "Beginner": {
                                        active: "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20",
                                        iconBg: "bg-green-100 dark:bg-green-900/30",
                                        check: "text-green-600 dark:text-green-400"
                                    },
                                    "Intermediate": {
                                        active: "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20",
                                        iconBg: "bg-blue-100 dark:bg-blue-900/30",
                                        check: "text-blue-600 dark:text-blue-400"
                                    },
                                    "Advanced": {
                                        active: "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20",
                                        iconBg: "bg-purple-100 dark:bg-purple-900/30",
                                        check: "text-purple-600 dark:text-purple-400"
                                    }
                                };

                                const styles = levelColors[level];
                                const isActive = fitnessLevel === level;

                                return (
                                    <Card
                                        key={level}
                                        className={`cursor-pointer transition-all ${isActive
                                            ? styles.active
                                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                        onClick={() => setFitnessLevel(level)}
                                    >
                                        <div className="h-20 px-4 flex items-center justify-between w-full">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 shrink-0 rounded-full grid place-items-center ${isActive ? styles.iconBg : "bg-slate-100 dark:bg-slate-800"}`}>
                                                    {level === "Beginner" && <MdMonitorHeart className={`w-5 h-5 ${isActive ? styles.check : "text-slate-400"}`} />}
                                                    {level === "Intermediate" && <MdWhatshot className={`w-5 h-5 ${isActive ? styles.check : "text-slate-400"}`} />}
                                                    {level === "Advanced" && <MdBolt className={`w-5 h-5 ${isActive ? styles.check : "text-slate-400"}`} />}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{level}</span>
                                            </div>
                                            {isActive && (
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    <MdCheck className={`w-5 h-5 ${styles.check}`} />
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                            <p className="text-xs text-center text-slate-500 mt-2">
                                {fitnessLevel === "Beginner" && "Focus on stability and form mastery."}
                                {fitnessLevel === "Intermediate" && "Standard progressions and volume."}
                                {fitnessLevel === "Advanced" && "Unlocks complex moves (Pistol Squats, Muscle-ups)."}
                            </p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                        {currentSlide > 0 && (
                            <Button variant="outline" onClick={prevSlide} className="flex-1">
                                <MdChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        )}

                        {slide.id === "config_limits" ? (
                            <Button
                                onClick={handleGenerate}
                                disabled={selectedDays.length === 0}
                                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25"
                            >
                                Generate Plan
                            </Button>
                        ) : slide.id === "custom_placeholder" ? (
                            <Button disabled className="flex-[2] bg-slate-200 text-slate-400 cursor-not-allowed">
                                Next <MdChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <div className="flex w-full gap-3">
                                {slide.id === "intro" && (
                                    <Button
                                        onClick={quickStart}
                                        variant="ghost"
                                        className="flex-1 text-slate-500 hover:text-slate-700"
                                    >
                                        Skip Setup
                                    </Button>
                                )}
                                <Button
                                    onClick={nextSlide}
                                    disabled={
                                        (slide.id === "config_days" && selectedDays.length === 0) ||
                                        (slide.id === "method_selection" && !planMethod)
                                    }
                                    className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
                                >
                                    {slide.id === "intro" ? "Let's Start" : "Next"} <MdChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 pt-2">
                        {SLIDES.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-blue-600 w-4" : "bg-slate-300"
                                    }`}
                            />
                        ))}
                    </div>



                </CardContent>
            </Card>
            {/* Loading Overlay */}
            {isGenerating && (
                <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="p-4 rounded-full bg-blue-500/20 mb-6 animate-pulse">
                        <MdMonitorHeart className="w-12 h-12 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                        Building Your Plan...
                    </h2>
                    <p className="text-slate-400 text-center max-w-xs">
                        Optimizing your schedule based on your preferences
                    </p>
                </div>
            )}
        </div >
    );
}
