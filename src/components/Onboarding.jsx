import React, { useState, useEffect } from "react";
import { Check, CalendarDays, Timer, XCircle, ChevronRight, ChevronLeft, Zap, Activity, Flame, LayoutTemplate, Dumbbell } from "lucide-react";
import { useUser } from "../context/UserContext";
import { predictSchedule } from "../logic/scienceAlgorithm";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "./ui";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SLIDES = [
    {
        id: "intro",
        title: "Welcome to DailyBurn",
        content: (
            <div className="space-y-4 text-center">
                <img src="/DailyBurn.svg" alt="Logo" className="w-24 h-24 mx-auto mb-4" />
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Your personalized path to fitness, powered by science.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    We build a plan based on your schedule and equipment, optimized for real physiological progression.
                </p>
            </div>
        )
    },
    {
        id: "system1",
        title: "System 1: Phosphagen",
        icon: <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />,
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
        icon: <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />,
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
        icon: <Activity className="w-12 h-12 text-green-500 mx-auto mb-4" />,
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
        icon: <LayoutTemplate className="w-8 h-8 text-indigo-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "algorithm_explainer",
        title: "The Science Engine",
        icon: <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />,
        content: (
            <div className="space-y-4 text-center">
                <p className="text-slate-600 dark:text-slate-300">
                    Our <strong>Metabolic Sculptor</strong> algorithm uses <strong>Undulating Periodization</strong>.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-sm text-left space-y-2 border border-slate-200 dark:border-slate-700">
                    <p>🧬 <strong>Mixes Intensity:</strong> Alternates between strength, power, and recovery to prevent burnout.</p>
                    <p>🔥 <strong>Fat Loss:</strong> Optimizes rest periods to maximize the "Afterburn" effect (EPOC).</p>
                    <p>🛡️ <strong>Safety:</strong> Adjusts volume based on your equipment and capability limits.</p>
                </div>
            </div>
        )
    },
    {
        id: "config_days",
        title: "Your Schedule",
        icon: <CalendarDays className="w-8 h-8 text-blue-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "config_level",
        title: "Experience Level",
        icon: <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "config_time",
        title: "Session Duration",
        icon: <Timer className="w-8 h-8 text-emerald-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "mode_explanation",
        title: "Your Training Mode",
        icon: <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "config_limits",
        title: "Limitations",
        icon: <XCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />,
        content: null
    },
    {
        id: "custom_placeholder",
        title: "Custom Builder",
        content: (
            <div className="text-center space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                        <Activity className="h-8 w-8" />
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/95 p-4 backdrop-blur-sm overflow-y-auto safe-area-padding">
            <Card className="w-full max-w-lg shadow-2xl ring-1 ring-slate-200 my-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
                <CardHeader className="text-center pb-2 pt-6">
                    {slide.icon && <div className="flex justify-center mb-2">{slide.icon}</div>}
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">{slide.title}</CardTitle>
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
                                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20"
                                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900">Auto-Generate Plan</h4>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Answer 3 quick questions and get a science-based plan instantly.
                                        </p>
                                    </div>
                                    {planMethod === "auto" && <div className="bg-blue-600 rounded-full p-1"><Check className="h-4 w-4 text-white" /></div>}
                                </div>
                            </button>

                            <button
                                onClick={() => setPlanMethod("custom")}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${planMethod === "custom"
                                    ? "border-purple-600 bg-purple-50/50 ring-1 ring-purple-600/20"
                                    : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg shadow-sm">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900">Build From Scratch</h4>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Manually select exercises and build your own routine piece by piece.
                                        </p>
                                    </div>
                                    {planMethod === "custom" && <div className="bg-purple-600 rounded-full p-1"><Check className="h-4 w-4 text-white" /></div>}
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Step 1: Days */}
                    {slide.id === "config_days" && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-900">Weekly Schedule</span>
                                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    {selectedDays.length} / 7 Selected
                                </Badge>
                            </div>

                            {/* Legend */}
                            {selectedDays.length >= 2 && (
                                <div className="flex justify-center gap-4 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                    {true && (
                                        <>
                                            <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Power</div>
                                            <div className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> Burn</div>
                                            <div className="flex items-center gap-1"><Activity className="w-3 h-3 text-green-500" /> Endurance</div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {WEEKDAYS.map((day) => {
                                    const isSelected = selectedDays.includes(day);

                                    // Determine Icon based on Prediction
                                    let Icon = Check;
                                    let iconColor = "text-white";

                                    if (isSelected) {
                                        // Use the actual algorithm prediction
                                        const schedule = predictSchedule(selectedDays);
                                        const prediction = schedule[day];

                                        if (prediction?.iconType === "Zap") {
                                            Icon = Zap;
                                            iconColor = "text-yellow-200";
                                        } else if (prediction?.iconType === "Flame") {
                                            Icon = Flame;
                                            iconColor = "text-orange-200";
                                        } else if (prediction?.iconType === "Activity") {
                                            Icon = Activity;
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
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[15, 20, 25, 30, 35, 40, 45].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setTime(val)}
                                        className={`
                                            h-12 rounded-xl text-sm font-bold transition-all border select-none active:scale-95
                                            ${time === val
                                                ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        {val} min
                                    </button>
                                ))}
                            </div>

                            {/* Smart Advisor Warning */}
                            {showAdvisor && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                                    <Activity className="h-4 w-4 shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Coach's Tip:</strong> Training 6+ days at high duration is intense! Consider reducing time to 30m or we'll automatically add "Active Recovery" days.
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* Step 2.5: Mode Explanation */}
                    {slide.id === "mode_explanation" && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 text-center">
                            {time <= 30 ? (
                                <>
                                    <div className="p-4 bg-orange-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Zap className="h-10 w-10 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Circuit Mode</h3>
                                        <p className="text-slate-500 font-medium mt-1">Short Duration • High Intensity</p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl text-sm text-left border border-orange-100 space-y-2">
                                        <p>⚡ <strong>Fast Paced:</strong> Minimal rest between exercises to keep your heart rate up.</p>
                                        <p>🔄 <strong>4 Rounds:</strong> High volume in a short time window.</p>
                                        <p>🔥 <strong>Goal:</strong> Maximum calorie burn and conditioning.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-indigo-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                                        <Dumbbell className="h-10 w-10 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Superset Mode</h3>
                                        <p className="text-slate-500 font-medium mt-1">Standard Duration • Strength Focus</p>
                                    </div>
                                    <div className="bg-indigo-50 p-4 rounded-xl text-sm text-left border border-indigo-100 space-y-2">
                                        <p>💪 <strong>Strength First:</strong> Longer rest periods to maximize lift quality.</p>
                                        <p>🔄 <strong>3 Rounds:</strong> Focused volume for hypertrophy.</p>
                                        <p>📈 <strong>Goal:</strong> Build muscle and increase raw strength.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Limits */}
                    {slide.id === "config_limits" && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { id: "no_bar", label: "No Pull-up Bar" },
                                    { id: "no_furniture", label: "No Furniture (Bench/Chair)" },
                                    { id: "no_wall", label: "No Access to Wall" },
                                    { id: "wrist_pain", label: "Wrist Pain (No Floor Push-ups)" },
                                    { id: "knee_pain", label: "Knee Pain (No Squats/Jumps)" },
                                    { id: "no_jumping", label: "No Jumping (Low Impact)" }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => toggleExclusion(opt.id)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all border text-left select-none active:scale-[0.98]
                                            ${exclusions.includes(opt.id)
                                                ? "border-amber-500 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-500/20"
                                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        <div className={`
                                            w-5 h-5 rounded-md flex items-center justify-center border transition-colors
                                            ${exclusions.includes(opt.id) ? "bg-amber-500 border-amber-500" : "border-slate-300 bg-white"}
                                        `}>
                                            {exclusions.includes(opt.id) && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 text-center">Select any restrictions that apply to you.</p>
                        </div>
                    )}

                    {/* Step 1.5: Fitness Level */}
                    {slide.id === "config_level" && (
                        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => (
                                <Card
                                    key={level}
                                    className={`cursor-pointer transition-all ${fitnessLevel === level
                                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                    onClick={() => setFitnessLevel(level)}
                                >
                                    <div className="h-20 px-4 flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 shrink-0 rounded-full grid place-items-center ${fitnessLevel === level ? "bg-blue-200 dark:bg-blue-800" : "bg-slate-100 dark:bg-slate-800"}`}>
                                                {level === "Beginner" && <Activity className="w-5 h-5 text-blue-600" />}
                                                {level === "Intermediate" && <Flame className="w-5 h-5 text-orange-600" />}
                                                {level === "Advanced" && <Zap className="w-5 h-5 text-yellow-600" />}
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-slate-100">{level}</span>
                                        </div>
                                        {fitnessLevel === level && (
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                <Check className="w-5 h-5 text-blue-600" />
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
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
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
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
                                Next <ChevronRight className="ml-2 h-4 w-4" />
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
                                    {slide.id === "intro" ? "Let's Start" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
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
                        <Activity className="w-12 h-12 text-blue-400" />
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
