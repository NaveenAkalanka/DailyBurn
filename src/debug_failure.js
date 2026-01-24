import { generateSciencePlan } from "./logic/scienceAlgorithm.js";
import { EXERCISE_LIBRARY } from "./data/exercises.js";

console.log("DEBUG: Investigating Scenario 001 (Beginner, 10m)");

// Inputs from log that failed
const inputs = {
    skill: "Beginner",
    time: 10,
    constraints: [],
    equipment: [], // Empty means "Standard Home" implies all
    context: "Monday"
};

console.log("Inputs:", inputs);

// 1. Check EXERCISE_LIBRARY entry for "Pull-up"
const pullup = EXERCISE_LIBRARY.find(e => e.name === "Pull-up");
console.log("Pull-up Data:", pullup);

// 2. Run Generation
const plan = generateSciencePlan({
    selectedDays: ["Monday"],
    time: 10,
    exclusions: [],
    skill: "Beginner",
    equipment: []
});

// 3. Inspect Result
const mon = plan[0];
const allEx = mon.rawBlocks.flatMap(b => b.exercises || []);
const hasPullup = allEx.some(e => e.name === "Pull-up");

console.log(`Has Pull-up? ${hasPullup}`);
if (hasPullup) console.error("FAIL: Beginner plan has Pull-up (Index 50)");
else console.log("PASS: Pull-up excluded.");
