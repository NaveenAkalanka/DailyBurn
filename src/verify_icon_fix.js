import { generateSciencePlan } from "./logic/scienceAlgorithm.js";

console.log("🧪 Starting Verification: oxidative Icon Fix...");

// 1. Setup Input that guarantees an "oxidative" day (Index 2 in the cycle)
// Cycle: phosphagen (0) -> glycolytic (1) -> oxidative (2)
const inputs = {
    selectedDays: ["Monday", "Tuesday", "Wednesday"], // Wednesday should be Oxidative
    time: 45,
    exclusions: [],
    fitnessLevel: "Intermediate",
    equipment: []
};

// 2. Generate Plan
const plan = generateSciencePlan(inputs);

// 3. Inspect Wednesday (Index 2)
const targetDay = plan[2];
console.log(`\nDay 3 (${targetDay.day}) System: ${targetDay.systemFocus}`);
console.log(`Icon Assigned: "${targetDay.iconName}"`);
console.log(`Color Assigned: "${targetDay.color}"`);

// 4. Validate
if (targetDay.iconName === "Activity") {
    console.log("\n✅ PASS: Icon is correctly set to 'Activity'");
    if (targetDay.color === "ring-green-500") {
        console.log("✅ PASS: Color is correctly Green");
    } else {
        console.log(`⚠️ WARN: Color is ${targetDay.color} (Expected Green)`);
    }
    process.exit(0);
} else {
    console.error(`\n❌ FAIL: Expected 'Activity', got '${targetDay.iconName}'`);
    process.exit(1);
}
