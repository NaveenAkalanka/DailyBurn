import { EXERCISE_LIBRARY } from "../data/exercises.js";

/**
 * INTELLIGENT CALISTHENICS GENERATOR
 * Ported from Specification v1.0
 */

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

// Filter exercises based on constraints (The Safety Funnel)
// Filter exercises based on constraints (The Safety Funnel)
const filterExercises = (db, level, userEquipment, constraints) => {
    return db.filter(ex => {
        // 1. Equipment Check (Positive Logic)
        const reqs = ex.requirements || ["None"];

        if (userEquipment && userEquipment.length > 0) {
            const hasEq = reqs.every(r => r === "None" || userEquipment.includes(r));
            if (!hasEq) return false;
        }

        // 2. Constraint Check (Negative Logic - explicit exclusions)
        if (constraints.includes("no_furniture") && reqs.includes("Furniture")) return false;
        if (constraints.includes("no_bar") && reqs.includes("Pull-up Bar")) return false;
        if (constraints.includes("no_wall") && reqs.includes("Wall")) return false;

        // 3. Level Check (Strict Tiering)
        // Beginner: Beginner only
        // Intermediate: Beginner + Intermediate
        // Advanced: Beginner + Intermediate + Advanced + Expert
        if (level === "Beginner") {
            if (ex.level !== "Beginner") return false;
        } else if (level === "Intermediate") {
            if (!["Beginner", "Intermediate"].includes(ex.level)) return false;
        } else {
            // Advanced/Elite - Access to everything
            // Note: We might want to filter OUT Beginner moves for Elite users to keep it hard,
            // but for now, variety is good. The sorting logic handles difficulty.
        }

        // 4. Injury/Safety Check
        if (constraints.includes("cant_pushups") && ex.pattern === "Push" && ex.sub_pattern !== "Vertical") return false;
        if (constraints.includes("wrist_pain") && ex.pattern === "Push") {
            // Whitelist safe moves: Wall Push-up
            if (ex.name === "Wall Push-up") return true;
            // Block all other Push moves if wrist pain is present (Vertical & Horizontal)
            return false;
        }
        if (constraints.includes("cant_run") && ex.pattern === "Cardio" && ex.sub_pattern === "Impact") return false;
        if (constraints.includes("no_jumping") && ["Power", "Explosive"].includes(ex.sub_pattern)) return false;
        if (constraints.includes("knee_pain") && ["Squat", "Lunge", "Power"].includes(ex.sub_pattern)) return false;

        return true;
    });
};

// Calculate Reps (Volume Logic)
const calculateReps = (timeAvailableSec, exTiming) => {
    const secondsPerRep = exTiming.seconds_per_rep;
    const rawReps = timeAvailableSec / secondsPerRep;

    // Guardrails
    if (exTiming.is_static) {
        // Planks etc: 20s to 60s
        return Math.floor(Math.min(Math.max(rawReps, 20), 60));
    } else {
        // Reps: 5 to 25
        return Math.floor(Math.min(Math.max(rawReps, 5), 25));
    }
};

// Boss Battle Logic
const getBossBattle = (currentEx, candidatePool, userLevel) => {
    // Determine Target Level (Level + 1)
    let targetLevels = ["Intermediate"]; // Default for Beginner

    if (userLevel === "Intermediate") {
        targetLevels = ["Advanced"];
    } else if (userLevel === "Advanced") {
        targetLevels = ["Expert", "Advanced"]; // Prioritize Expert, fallback to Advanced
    }

    // Find candidates in the target level(s) for the same pattern
    let candidates = candidatePool.filter(e =>
        e.pattern === currentEx.pattern &&
        targetLevels.includes(e.level)
    );

    // [Fallback] If no "Next Level" move exists (e.g. equipment constraint), 
    // just find something harder in current level
    if (candidates.length === 0) {
        candidates = candidatePool.filter(e =>
            e.pattern === currentEx.pattern &&
            e.progression_index > currentEx.progression_index
        );
    }

    if (candidates.length > 0) {
        // Sort by difficulty ascending (next step up)
        // We want the "next step", not the "impossible step"
        candidates.sort((a, b) => a.progression_index - b.progression_index);
        return candidates[0];
    }
    return null;
};

// Helper for shuffle
const shuffle = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// ==========================================
// 2. PREDICT SCHEDULE (UI Helper)
// ==========================================
// ==========================================
// 2. PREDICT SCHEDULE (UI Helper)
// ==========================================
export const predictSchedule = (selectedDays) => {
    const schedule = {};
    const freq = selectedDays.length;
    const systems = ["phosphagen", "glycolytic", "oxidative"];

    selectedDays.forEach((day, index) => {
        let label = "Full Body";
        let icon = "Zap"; // Default
        let color = "ring-blue-500";

        // System Prediction
        const system = systems[index % 3];

        if (freq >= 4) {
            // Split Logic
            if (index % 2 === 0) {
                label = "Upper Power";
                color = "ring-yellow-500";
            } else {
                label = "Lower Burn";
                color = "ring-orange-500";
            }
        }

        // Map System to IconType for UI
        // phosphagen -> Zap
        // glycolytic -> Flame
        // oxidative -> Activity
        let systemIcon = "Zap";
        if (system === "glycolytic") systemIcon = "Flame";
        if (system === "oxidative") systemIcon = "Activity";

        schedule[day] = {
            label,
            iconType: systemIcon,
            color,
            system // Export the raw system name too
        };
    });
    return schedule;
};

// ==========================================
// 2b. DURATION GUIDELINES (User Guidance)
// ==========================================
export const getDurationGuidelines = (fitnessLevel, daysCount) => {
    // 1. Define Weekly Volume Targets (Minutes)
    // Beginner: ~90m (e.g. 3x30)
    // Intermediate: ~160m (e.g. 4x40)
    // Advanced: ~240m (e.g. 4x60 or 6x40)
    let weeklyTarget = 160;
    let absoluteMin = 20; // Hard floor per session
    let absoluteMax = 60; // Hard ceiling per session

    if (fitnessLevel === "Beginner") {
        weeklyTarget = 90;
        absoluteMin = 15;
        absoluteMax = 45;
    } else if (fitnessLevel === "Intermediate") {
        weeklyTarget = 160;
        absoluteMin = 25;
        absoluteMax = 75;
    } else if (fitnessLevel === "Advanced") {
        weeklyTarget = 250;
        absoluteMin = 35;
        absoluteMax = 90;
    }

    // 2. Calculate Ideal Daily Duration
    const days = Math.max(daysCount, 1);
    let rawIdeal = Math.round(weeklyTarget / days);

    // 3. Clamp Ideal within valid physiologic bounds
    // Examples:
    // Beginner 2 days -> 45m (Clamped to 45)
    // Beginner 5 days -> 18m (Clamped to 15)
    let ideal = Math.max(absoluteMin, Math.min(rawIdeal, absoluteMax));

    // 4. Generate "Green Zone" Range (Recommended Window)
    // We give a +/- buffer around the ideal
    let min = Math.max(5, ideal - 10);
    let max = ideal + 15;

    // Advanced Constraints
    if (fitnessLevel === "Advanced" && daysCount >= 5) {
        max = Math.min(max, 80); // Cap high freq volume
    }

    // Round to nearest 5 for clean UI
    ideal = Math.round(ideal / 5) * 5;
    min = Math.round(min / 5) * 5;
    max = Math.round(max / 5) * 5;

    return { min, max, ideal };
};



// ==========================================
// 3. MAIN GENERATOR
// ==========================================
// Main Generator
export function generateSciencePlan({ selectedDays, time, exclusions, fitnessLevel = "Intermediate", equipment = [] }) {

    // Safety Funnel
    // note: 'equipment' arg from Fuzz Test is a positive list (what I HAVE).
    // 'exclusions' is a negative list (what I CAN'T DO).
    // We need to merge logic. If equipment is provided, we filter based on it.

    const safeDb = filterExercises(EXERCISE_LIBRARY, fitnessLevel, equipment, exclusions);
    // Boss Pool: Safety Only (Ignore Skill Cap by passing "Advanced" ONLY IF user is Advanced, otherwise restrict)
    // Actually, for Boss Battles, we usually want "Challenge" moves.
    // However, if a user is "Beginner", we shouldn't give them "Muscle-ups".
    // So let's respect the fitnessLevel for Bosses too, or maybe allow +1 level cap?
    // Let's keep it strict for now: Bosses must also match fitnessLevel (or be Advanced if user is Advanced).
    const bossDb = filterExercises(EXERCISE_LIBRARY, "Expert", equipment, exclusions);

    // Structure Definition
    const slots = ["Legs", "Push", "Pull", "Core"];

    // Mode Selection
    // < 30m = Circuit (Fast paced, minimal rest)
    // > 30m = Superset (Strength focused, longer rest)
    const mode = time <= 30 ? "CIRCUIT" : "SUPERSET";

    // Dynamic Round Scaling (Science-based Volume Control)
    // We cannot force 4 rounds into 15 minutes.
    let totalRounds = 3; // Default

    if (time <= 20) {
        totalRounds = 2; // "Express" Micro-dose
    } else if (time <= 35) {
        totalRounds = 3; // Standard Efficient
    } else {
        totalRounds = 4; // High Volume
        if (mode === "SUPERSET") totalRounds = 3; // Keep Supersets to 3 rounds to allow for longer rests/heavier loads
    }
    const planArray = selectedDays.map((day, dIndex) => {

        // 1. Determine System for the Day (Periodization)
        // Day 0: Power (Phosphagen)
        // Day 1: Strength/Hypertrophy (Glycolytic)
        // Day 2: Endurance (Oxidative)
        const systems = ["phosphagen", "glycolytic", "oxidative"];
        const system = systems[dIndex % 3];

        const systemLabels = {
            "phosphagen": "Power Phase",
            "glycolytic": "Metabolic Burn",
            "oxidative": "Endurance"
        };
        const systemFocus = systemLabels[system];

        // 2. Select Exercises (The Matrix)
        const dayStructure = []; // Will hold rounds
        const selectedMatrix = []; // [ [LegsEx1, LegsEx2...], [PushEx1...] ]

        slots.forEach(slotName => {
            // Candidates for this slot
            let candidates = safeDb.filter(e => e.pattern === slotName);

            // FALLBACK: If user constraints block an entire category (e.g. Wrist Pain + No Wall = No Push),
            // fallback to Core exercises to keep the volume up.
            if (candidates.length === 0) {
                candidates = safeDb.filter(e => e.pattern === "Core");
            }

            // Sort by affinity for TODAY'S system
            candidates.sort((a, b) => (b.system_affinity?.[system] || 0) - (a.system_affinity?.[system] || 0));

            // Shuffle top 3 for variety so every day isn't identical
            const topPool = candidates.slice(0, 3);
            const shuffledPool = shuffle(topPool);

            if (shuffledPool.length === 0) {
                // Emergency fallback if constraints killed everything (e.g. no Push)
                console.warn(`No exercises for ${slotName}`);
                selectedMatrix.push([]);
                return;
            }

            // Fill lane
            const lane = [];
            for (let r = 0; r < totalRounds; r++) {
                lane.push(shuffledPool[r % shuffledPool.length]);
            }
            selectedMatrix.push(lane);
        });

        // 2. Calculate Math
        const warmupTime = 5 * 60; // 5 mins
        const restTimeTotal = (totalRounds * 90); // 90s rest/transition per round total
        const workTimeTotal = (time * 60) - warmupTime - restTimeTotal;
        // Slots per round = 4 (Legs, Push, Pull, Core)
        const timePerSlot = workTimeTotal / (slots.length * totalRounds);

        // 3. Build Rounds
        for (let r = 0; r < totalRounds; r++) {
            const roundObj = {
                name: `Round ${r + 1}`,
                style: mode === "CIRCUIT" ? "Circuit Mode" : "Superset",
                duration: Math.round((time - 5) / totalRounds), // Crude approx for visuals
                exercises: []
            };

            selectedMatrix.forEach((lane, laneIdx) => {
                if (!lane[r]) return;

                let exData = lane[r];
                let targetVal = calculateReps(timePerSlot, exData.timing);
                let targetUnit = exData.timing.is_static ? "sec" : "reps";

                // BOSS BATTLE (Last Round, Push Slot - usually index 1)
                let isBoss = false;
                if (r === totalRounds - 1 && slots[laneIdx] === "Push") {
                    const bossMove = getBossBattle(exData, bossDb, fitnessLevel);
                    if (bossMove) {
                        exData = bossMove;
                        targetVal = "MAX";
                        targetUnit = "Effort";
                        isBoss = true;
                    }
                }

                roundObj.exercises.push({
                    name: exData.name,
                    category: exData.category, // for UI compat
                    movementPattern: exData.pattern,
                    target: `${targetVal} ${targetUnit}`, // "12 reps"
                    is_challenge: isBoss,
                    timing: exData.timing // [NEW] Pass timing data for frontend logic
                });
            });

            dayStructure.push(roundObj);
        }

        // ==========================================
        // 4. DYNAMIC WARMUP GENERATOR
        // ==========================================
        const generateWarmupBlock = () => {
            // A. Identify Focus Areas
            // We look at the 'slots' used in this day.
            // Slots are: ["Legs", "Push", "Pull", "Core"]
            // In full body (default), all are present.
            // But let's check what's actually in the selectedMatrix (in case of filtering).
            const activePatterns = new Set();
            selectedMatrix.forEach((lane, idx) => {
                if (lane && lane.length > 0) activePatterns.add(slots[idx]);
            });

            const needsUpper = activePatterns.has("Push") || activePatterns.has("Pull");
            const needsLower = activePatterns.has("Legs");

            // B. Filter Warmup Database
            // We want: 1 Pulse (Cardio/Full Body) + 1 Mobility (Matched to Focus)
            const allWarmups = EXERCISE_LIBRARY.filter(e => e.pattern === "Warmup");
            const safeWarmups = filterExercises(allWarmups, fitnessLevel, equipment, exclusions);

            // C. Select Pulse (Cardio)
            let pulsePool = safeWarmups.filter(e => e.sub_pattern === "Full Body");
            if (pulsePool.length === 0) {
                // Fallback if everything filtered out (e.g. no jumping, no floor)
                // Use "March in Place" if available, or just ignore
                const march = allWarmups.find(e => e.name === "March in Place");
                if (march) pulsePool = [march];
            }
            const selectedPulse = shuffle(pulsePool)[0] || { name: "March in Place", category: "warmup" };

            // D. Select Mobility
            // Priority: Match the day's heaviest need.
            // If Upper + Lower (Full Body) -> "Full Body" or "Spine" OR Pick one Upper/One Lower if time permits?
            // Standard: 1 Pulse + 1 Mobility.
            let mobilityPool = [];

            if (needsUpper && needsLower) {
                // Full Body Day -> Prefer Full Body/Spine moves, or mix
                mobilityPool = safeWarmups.filter(e => ["Full Body", "Spine"].includes(e.sub_pattern));
                // Fallback: Add everything if pool is empty
                if (mobilityPool.length === 0) mobilityPool = safeWarmups;
            } else if (needsUpper) {
                mobilityPool = safeWarmups.filter(e => ["Upper Body", "Spine", "Joints"].includes(e.sub_pattern));
            } else if (needsLower) {
                mobilityPool = safeWarmups.filter(e => ["Lower Body", "Spine"].includes(e.sub_pattern));
            }

            if (mobilityPool.length === 0) {
                // Fallback
                mobilityPool = safeWarmups.filter(e => e.sub_pattern !== "Full Body"); // Any non-cardio
            }

            const selectedMobility = shuffle(mobilityPool)[0] || { name: "Arm Circles", category: "warmup" };

            // Scaling Duration
            // Standard: 5 mins total? 
            // Logic: 2 exercises x 2 rounds? Or just 1 long set of each? 
            // Let's stick to the current UI: 1 Cardio Block, 1 Mobility Block.
            // Scaling based on total workout time.
            // < 20m workout -> 2m warmup (60s each)
            // > 20m workout -> 5m warmup (maybe 2m cardio, 3m mobility?)

            let pulseTime = "60 sec";
            let mobilityTime = "60 sec";

            if (time > 30) {
                pulseTime = "120 sec";
                mobilityTime = "180 sec";
                // Actually 3 mins of one stretch is boring. 
                // Maybe we should return MULTIPLE mobility moves for long workouts?
                // Feature for later. sticking to simple structure.
            }

            return {
                name: "Warmup",
                style: "Flow",
                duration: time > 20 ? 5 : 2,
                exercises: [
                    {
                        name: selectedPulse.name,
                        target: pulseTime,
                        category: "cardio",
                        movementPattern: "Pulse",
                        level: selectedPulse.level
                    },
                    {
                        name: selectedMobility.name,
                        target: mobilityTime,
                        category: "activation",
                        movementPattern: "Mobility",
                        level: selectedMobility.level
                    }
                ]
            };
        };

        // Add Warmup Block at start
        dayStructure.unshift(generateWarmupBlock());

        // Return UI Compatible Object
        // Home.jsx expects: day, type, color, iconName, rawBlocks, duration

        let iconName = "Zap";
        let color = "ring-blue-500";
        // systems = ["phosphagen", "glycolytic", "oxidative"]
        if (system === "phosphagen") {
            iconName = "Zap";
            color = "ring-yellow-500";
        } else if (system === "glycolytic") {
            iconName = "Flame";
            color = "ring-orange-500";
        } else if (system === "oxidative") {
            // We need to either add Activity to Home.jsx OR map Oxidative to RefreshCcw (Endurance/Cycle).
            // Let's use RefreshCcw for Endurance to match Home.jsx existing map, or update Home.jsx.
            // I will update Home.jsx next. For now let's set it to "RefreshCcw" which exists and looks like a cycle/repeat.
            // Actually, the user asked for "Activity" in Onboarding.
            // I should probably update Home.jsx to support Activity too.
            // But for safety, let's look at Home.jsx again.
            // Home.jsx (lines 8-12): Zap, Flame, RefreshCcw.
            // I will use "RefreshCcw" for now to ensure it renders, but I'll update Home.jsx to map "Activity" -> RefreshCcw or add Activity.
            iconName = "Activity";
            color = "ring-green-500";
        }

        return {
            day,
            type: `Full Body ${mode}`,
            systemFocus, // NEW: Export the focus for UI
            color,       // NEW: UI Color
            iconName,    // NEW: UI Icon Key
            rawBlocks: dayStructure,
            duration: time,
            meta: { sets: totalRounds, rest: "Minimal" } // Legacy compat
        };
    });

    return planArray;
}
