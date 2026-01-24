import { EXERCISE_LIBRARY } from "../data/exercises.js";

/**
 * INTELLIGENT CALISTHENICS GENERATOR
 * Ported from Specification v1.0
 */

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

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

        // 3. Level Check (Skill Ceiling)
        if (level === "Beginner" && ex.progression_index > 30) return false;

        // 4. Injury/Safety Check
        if (constraints.includes("cant_pushups") && ex.pattern === "Push" && ex.sub_pattern !== "Vertical") return false;
        if (constraints.includes("wrist_pain") && ex.pattern === "Push") {
            // Whitelist safe moves: Wall Push-up
            if (ex.name === "Wall Push-up") return true;
            // Vertical is unsafe for wrists if it's Pike Push-up (lots of weight on wrists).
            // Vertical Pulls are fine, but this is Push pattern.
            // If it's Vertical Push (Handstand/Pike), it's generally WRIST HEAVY.
            // So we exclude ALL Push unless it's Wall Push-up.
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
const getBossBattle = (currentEx, candidatePool) => {
    // Find next hardest move in same pattern
    const candidates = candidatePool.filter(e =>
        e.pattern === currentEx.pattern &&
        e.progression_index > currentEx.progression_index
    );

    if (candidates.length > 0) {
        // Sort by difficulty ascending (next step up)
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
    const bossDb = filterExercises(EXERCISE_LIBRARY, fitnessLevel === "Advanced" ? "Advanced" : fitnessLevel, equipment, exclusions);

    // Structure Definition
    const slots = ["Legs", "Push", "Pull", "Core"];

    // Mode Selection
    // < 30m = Circuit (4 Rounds, fast)
    // > 30m = Superset (3 Rounds, slower)
    const mode = time <= 30 ? "CIRCUIT" : "SUPERSET";
    const totalRounds = mode === "CIRCUIT" ? 4 : 3;
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
                    const bossMove = getBossBattle(exData, bossDb);
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
                    is_challenge: isBoss
                });
            });

            dayStructure.push(roundObj);
        }

        // Add Warmup Block at start
        // Dynamic Warmup
        // Dynamic Warmup
        // Dynamic Warmup Pool
        // Scientific Warmup Logic (System Matched)
        // Phosphagen -> Explosive/Rotational
        // Glycolytic -> High Intensity/Upper Body
        // Oxidative -> Steady State/Lower Body

        const getWarmupForSystem = (sys, excl) => {
            let cardio = "Jumping Jacks";
            let mobility = "Arm Circles";

            if (sys === "phosphagen") {
                cardio = "Seal Jacks"; // Explosive
                mobility = "Torso Twists"; // Rotational Power
            } else if (sys === "glycolytic") {
                cardio = "High Knees"; // Metabolic
                mobility = "Shoulder Rolls"; // Upper Body Pump
            } else if (sys === "oxidative") {
                cardio = "Boxer Shuffle"; // Steady
                mobility = "Hip Circles"; // Lower Body flow
            }

            // SAFETY OVERRIDES (Crucial)
            // If the "Scientific Choice" is unsafe, fallback to the safest options.
            const unsafeJumps = ["no_jumping", "knee_pain"];
            const unsafeRun = ["cant_run"];

            // Cardio Safety Check
            let isUnsafeCardio = false;
            // specific checks per move
            if (cardio === "Jumping Jacks" || cardio === "Seal Jacks" || cardio === "Boxer Shuffle") {
                if (excl.some(e => unsafeJumps.includes(e))) isUnsafeCardio = true;
            }
            if (cardio === "High Knees") {
                if (excl.some(e => [...unsafeJumps, ...unsafeRun].includes(e))) isUnsafeCardio = true;
            }

            if (isUnsafeCardio) {
                cardio = "March in Place"; // The universal safe fallback
            }

            return { cardio, mobility };
        };

        const { cardio: cardioMove, mobility: mobilityMove } = getWarmupForSystem(system, exclusions);

        // Add Warmup Block at start
        dayStructure.unshift({
            name: "Warmup",
            style: "Flow",
            duration: 5,
            exercises: [
                { name: cardioMove, target: "60 sec", category: "cardio", movementPattern: "Cardio" },
                { name: mobilityMove, target: "30 sec", category: "activation", movementPattern: "Mobility" }
            ]
        });

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
