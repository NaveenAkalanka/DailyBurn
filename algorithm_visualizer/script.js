// ==========================================
// 1. ENGINE (Ported Logic)
// ==========================================

const filterExercises = (db, level, userEquipment, constraints) => {
    return db.filter(ex => {
        const reqs = ex.requirements || ["None"];

        // 1. Equipment
        if (userEquipment && userEquipment.length > 0) {
            const hasEq = reqs.every(r => r === "None" || userEquipment.includes(r));
            if (!hasEq) return false;
        }

        // 2. Constraints (Negative)
        if (constraints.includes("no_furniture") && reqs.includes("Furniture")) return false;
        if (constraints.includes("no_bar") && reqs.includes("Pull-up Bar")) return false;
        if (constraints.includes("no_wall") && reqs.includes("Wall")) return false;

        // 3. Level
        if (level === "Beginner") {
            if (ex.level !== "Beginner") return false;
        } else if (level === "Intermediate") {
            if (!["Beginner", "Intermediate"].includes(ex.level)) return false;
        }
        // Advanced gets everything

        // 4. Injury Check
        if (constraints.includes("cant_pushups") && ex.pattern === "Push" && ex.sub_pattern !== "Vertical") return false;
        if (constraints.includes("wrist_pain") && ex.pattern === "Push") {
            if (ex.name === "Wall Push-up") return true;
            return false;
        }
        if (constraints.includes("cant_run") && ex.pattern === "Cardio" && ex.sub_pattern === "Impact") return false;
        if (constraints.includes("no_jumping") && ["Power", "Explosive"].includes(ex.sub_pattern)) return false;
        if (constraints.includes("knee_pain") && ["Squat", "Lunge", "Power"].includes(ex.sub_pattern)) return false;

        return true;
    });
};

const calculateReps = (timeAvailableSec, exTiming) => {
    const secondsPerRep = exTiming.seconds_per_rep;
    const rawReps = timeAvailableSec / secondsPerRep;
    if (exTiming.is_static) {
        return Math.floor(Math.min(Math.max(rawReps, 20), 60));
    } else {
        return Math.floor(Math.min(Math.max(rawReps, 5), 25));
    }
};

const getBossBattle = (currentEx, candidatePool, userLevel) => {
    let targetLevels = ["Intermediate"];
    if (userLevel === "Intermediate") targetLevels = ["Advanced"];
    else if (userLevel === "Advanced") targetLevels = ["Expert", "Advanced"];

    let candidates = candidatePool.filter(e => e.pattern === currentEx.pattern && targetLevels.includes(e.level));

    if (candidates.length === 0) {
        candidates = candidatePool.filter(e => e.pattern === currentEx.pattern && e.progression_index > currentEx.progression_index);
    }

    if (candidates.length > 0) {
        candidates.sort((a, b) => a.progression_index - b.progression_index);
        return candidates[0];
    }
    return null;
};

const shuffle = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

function generateSciencePlan({ selectedDays, time, exclusions, fitnessLevel = "Intermediate", equipment = [] }) {
    console.log("Generating plan for:", { selectedDays, time, exclusions, fitnessLevel, equipment });

    // Safety Funnel
    const safeDb = filterExercises(EXERCISE_LIBRARY, fitnessLevel, equipment, exclusions);
    const bossDb = filterExercises(EXERCISE_LIBRARY, "Expert", equipment, exclusions);

    if (safeDb.length === 0) {
        log("CRITICAL: No exercises found after filtering!", "warn");
        return [];
    }

    const slots = ["Legs", "Push", "Pull", "Core"];
    const mode = time <= 30 ? "CIRCUIT" : "SUPERSET";
    const totalRounds = mode === "CIRCUIT" ? 4 : 3;

    // Periodization Logic
    const systems = ["phosphagen", "glycolytic", "oxidative"];

    // Split Logic Decision Tree
    let splitType = "Full Body";
    if (selectedDays.length >= 4) splitType = "Upper/Lower Split";

    log(`Logic: Frequency ${selectedDays.length} days -> Selected ${splitType} approach. Mode: ${mode}`, "info");

    const planArray = selectedDays.map((day, dIndex) => {
        const system = systems[dIndex % 3];
        const systemLabels = { "phosphagen": "Power Phase", "glycolytic": "Metabolic Burn", "oxidative": "Endurance" };
        const systemFocus = systemLabels[system];

        // Structure Definition changes based on split
        let daySlots = slots; // Default Full Body
        if (splitType === "Upper/Lower Split") {
            if (dIndex % 2 === 0) {
                // Upper
                daySlots = ["Push", "Pull", "Push", "Pull"]; // Double volume upper
            } else {
                // Lower
                daySlots = ["Legs", "Legs", "Core", "Core"]; // Double volume lower
            }
        }

        const dayStructure = [];
        const selectedMatrix = [];

        daySlots.forEach(slotName => {
            let candidates = safeDb.filter(e => e.pattern === slotName);
            // Fallback for empty slots
            if (candidates.length === 0) candidates = safeDb.filter(e => e.pattern === "Core");

            // Sort by System Affinity
            candidates.sort((a, b) => (b.system_affinity?.[system] || 0) - (a.system_affinity?.[system] || 0));

            const topPool = candidates.slice(0, 3);
            const shuffledPool = shuffle(topPool);

            const lane = [];
            for (let r = 0; r < totalRounds; r++) {
                lane.push(shuffledPool[r % shuffledPool.length] || { name: "Rest", category: "rest", timing: { seconds_per_rep: 1, is_static: false } });
            }
            selectedMatrix.push(lane);
        });

        // Math
        const warmupTime = 5 * 60;
        const restTimeTotal = (totalRounds * 90);
        const workTimeTotal = (time * 60) - warmupTime - restTimeTotal;
        const timePerSlot = workTimeTotal / (daySlots.length * totalRounds);

        for (let r = 0; r < totalRounds; r++) {
            const roundObj = {
                name: `Round ${r + 1}`,
                exercises: []
            };

            selectedMatrix.forEach((lane, laneIdx) => {
                let exData = lane[r];
                let targetVal = calculateReps(timePerSlot, exData.timing);
                let targetUnit = exData.timing.is_static ? "sec" : "reps";

                // Boss Logic
                let isBoss = false;
                // Only Boss Battle on Full Body days or relevant split days
                if (r === totalRounds - 1 && laneIdx === 1) { // 2nd slot usually main compound
                    const bossMove = getBossBattle(exData, bossDb, fitnessLevel);
                    if (bossMove) { exData = bossMove; targetVal = "MAX"; targetUnit = "Effort"; isBoss = true; }
                }

                roundObj.exercises.push({
                    name: exData.name,
                    target: `${targetVal} ${targetUnit}`,
                    is_challenge: isBoss
                });
            });
            dayStructure.push(roundObj);
        }

        return {
            day,
            system,
            systemFocus,
            splitType: splitType === "Upper/Lower Split" ? (dIndex % 2 === 0 ? "Upper" : "Lower") : "Full Body",
            rawBlocks: dayStructure
        };
    });

    return planArray;
}

// ==========================================
// 2. UI CONTROLLER
// ==========================================

// Logger
const logEl = document.getElementById('logicLog');
function log(msg, type = "info") {
    const div = document.createElement('div');
    div.className = `log-entry log-${type}`;
    div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    if (logEl) {
        logEl.appendChild(div);
        logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(msg);
}

function clearLog() {
    if (logEl) logEl.innerHTML = '';
}

// Render
function render(plan) {
    const list = document.getElementById('scheduleList');
    list.innerHTML = '';

    plan.forEach(day => {
        const card = document.createElement('div');
        card.className = 'day-card';

        let exHtml = '';
        // Flatten exercises for simple view
        // Just showing Round 1 to avoid clutter, or maybe summary
        const seenEx = new Set();
        day.rawBlocks.forEach(round => {
            round.exercises.forEach(ex => {
                if (!seenEx.has(ex.name)) {
                    exHtml += `
                        <div class="exercise-row">
                            <span class="ex-name">${ex.name} ${ex.is_challenge ? '🔥' : ''}</span>
                            <span class="ex-target">${ex.target}</span>
                        </div>
                    `;
                    seenEx.add(ex.name);
                }
            });
        });

        card.innerHTML = `
            <div class="day-header">
                <span class="day-title">${day.day}</span>
                <span class="ph-tag ph-${day.system}">${day.system}</span>
            </div>
            <div class="day-body">
                <div style="margin-bottom:10px; font-size:0.8rem; color:#94a3b8;">Focus: ${day.systemFocus} (${day.splitType})</div>
                ${exHtml}
            </div>
        `;
        list.appendChild(card);
    });
}

// State
const state = {
    fitnessLevel: "Intermediate",
    time: 30,
    days: ["Monday", "Wednesday", "Friday"],
    equipment: [],
    exclusions: []
};

// Event Listeners
document.getElementById('btnRun').addEventListener('click', () => {
    clearLog();
    log("Starting Generation...");

    // Update State from DOM
    state.fitnessLevel = document.getElementById('selLevel').value;
    state.time = parseInt(document.getElementById('inpTime').value);

    const daysOpts = Array.from(document.getElementById('selDays').selectedOptions).map(o => o.value);
    // If none selected, default to Mon/Wed/Fri
    state.days = daysOpts.length > 0 ? daysOpts : ["Monday", "Wednesday", "Friday"];

    // Eq
    const eqOpts = Array.from(document.getElementById('selEq').selectedOptions).map(o => o.value);
    state.equipment = eqOpts;

    // Run
    const plan = generateSciencePlan({
        selectedDays: state.days,
        time: state.time,
        exclusions: state.exclusions,
        fitnessLevel: state.fitnessLevel,
        equipment: state.equipment
    });

    render(plan);
    log("Plan Generated Successfully.", "success");
});

// Init
log("Visualizer Ready.");
