import { getDurationGuidelines, generateSciencePlan } from "./logic/scienceAlgorithm.js";
import { EXERCISE_LIBRARY } from "./data/exercises.js";

console.log("=== UNIT TEST: DAILYBURN ENGINE ===");

// 1. Duration Logic (Volume Targets)
console.log("\n[1] Testing Duration Guidelines...");
const cases = [
    { level: "Beginner", days: 3, expectedIdeal: 30 }, // 90 / 3 = 30
    { level: "Intermediate", days: 4, expectedIdeal: 40 }, // 160 / 4 = 40
    { level: "Advanced", days: 5, expectedIdeal: 50 }, // 250 / 5 = 50
    { level: "Beginner", days: 1, expectedIdeal: 45 }, // Clamped Max (45)
    { level: "Advanced", days: 7, expectedIdeal: 35 }  // 250 / 7 = 35.7 -> 35
];

cases.forEach(c => {
    const res = getDurationGuidelines(c.level, c.days);
    const pass = Math.abs(res.ideal - c.expectedIdeal) <= 5; // Allow rounding
    console.log(`  ${c.level} / ${c.days} Days -> Target: ${res.ideal}m (Expected: ~${c.expectedIdeal}) [${pass ? "PASS" : "FAIL"}]`);
});


// 2. Round Scaling Logic
console.log("\n[2] Testing Round Scaling...");
const durationTests = [15, 30, 45, 60];
const testDay = ["Monday"];

durationTests.forEach(time => {
    const plan = generateSciencePlan({
        selectedDays: testDay,
        time: time,
        exclusions: [],
        fitnessLevel: "Intermediate"
    });

    // Extract round count from the first block after Warmup
    // Plan structure: [DayObject] -> rawBlocks: [Warmup, Round1, Round2...]
    const rounds = plan[0].rawBlocks.filter(b => b.name.includes("Round")).length;
    console.log(`  ${time} min Session -> Generated ${rounds} Rounds`);
});


// 3. Safety Constraint Logic
console.log("\n[3] Testing Safety Funnel...");
const constraints = ["knee_pain", "no_bar"];
const planSafety = generateSciencePlan({
    selectedDays: ["Monday"],
    time: 30,
    exclusions: constraints,
    fitnessLevel: "Advanced"
});

const allExercises = planSafety[0].rawBlocks.flatMap(b => b.exercises);
const hasSquat = allExercises.some(e => e.name.includes("Squat") || e.name.includes("Lunge"));
const hasPullup = allExercises.some(e => e.name.includes("Pull-up"));

console.log(`  Constraint 'knee_pain' -> Has Squats? ${hasSquat} [${!hasSquat ? "PASS" : "FAIL"}]`);
console.log(`  Constraint 'no_bar' -> Has Pullups? ${hasPullup} [${!hasPullup ? "PASS" : "FAIL"}]`);

console.log("\n=== TEST COMPLETE ===");
