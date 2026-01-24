import { generateSciencePlan } from "./logic/scienceAlgorithm.js";

console.log("⚡ INTELLIGENT ENGINE DIAGNOSTICS ⚡\n");

// --- UTILS ---
function assert(condition, message) {
    if (condition) console.log(`[PASS] ${message}`);
    else console.error(`[FAIL] ${message}`);
}

// --- TEST 1: SAFETY FUNNEL ---
console.log("--- TEST 1: SAFETY FUNNEL (No Jumping) ---");
const planSafety = generateSciencePlan({
    selectedDays: ["Monday"],
    time: 30,
    exclusions: ["no_jumping"]
});
const monSafety = planSafety.find(d => d.day === "Monday");
// Extract all exercise names from all blocks (excluding Warmup)
// Note: Warmup is block 0, lets check main blocks
const mainBlocks = monSafety.rawBlocks.filter(b => b.name.includes("Round"));
const allExNamesSafety = mainBlocks.flatMap(b => b.exercises.map(e => e.name));

// Check for prohibited words
const hasJump = allExNamesSafety.some(n => n.toLowerCase().includes("jump") || n.toLowerCase().includes("burpee"));
if (hasJump) {
    console.error("[FAIL] Found banned exercises: " + allExNamesSafety.filter(n => n.toLowerCase().includes("jump") || n.toLowerCase().includes("burpee")).join(", "));
} else {
    console.log("[PASS] Safe Plan generated (No Jumping/Burpee detected)");
}


// --- TEST 2: CIRCUIT MODE (20 mins) ---
console.log("\n--- TEST 2: CIRCUIT MODE (20 mins) ---");
const planCircuit = generateSciencePlan({
    selectedDays: ["Monday"],
    time: 20,
    exclusions: []
});
const monCircuit = planCircuit[0];
assert(monCircuit.type.includes("CIRCUIT"), `Plan Type is '${monCircuit.type}' (Expected: includes CIRCUIT)`);
// Check Round count (excluding warmup)
const roundCountC = monCircuit.rawBlocks.filter(b => b.name.includes("Round")).length;
assert(roundCountC === 4, `Circuit has ${roundCountC} rounds (Expected 4)`);

// --- TEST 3: SUPERSET MODE (45 mins) ---
console.log("\n--- TEST 3: SUPERSET MODE (45 mins) ---");
const planSuper = generateSciencePlan({
    selectedDays: ["Monday"],
    time: 45,
    exclusions: []
});
const monSuper = planSuper[0];
assert(monSuper.type.includes("SUPERSET"), `Plan Type is '${monSuper.type}' (Expected: includes SUPERSET)`);
const roundCountS = monSuper.rawBlocks.filter(b => b.name.includes("Round")).length;
assert(roundCountS === 3, `Superset has ${roundCountS} rounds (Expected 3)`);


// --- TEST 4: BOSS BATTLE (Last Round) ---
console.log("\n--- TEST 4: BOSS BATTLE LOGIC ---");
// Check the Superset plan's last round
// rawBlocks structure: [Warmup, Round 1, Round 2, Round 3]
const lastRound = monSuper.rawBlocks[monSuper.rawBlocks.length - 1];
const bossEx = lastRound.exercises.find(e => e.is_challenge);

if (bossEx) {
    console.log(`[PASS] Boss Battle Detected: ${bossEx.name}`);
    console.log(`       Target: ${bossEx.target}`);
} else {
    console.error("[FAIL] No Boss Battle found in the final round.");
    console.log("DEBUG: Final round exercises:", lastRound.exercises.map(e => `${e.name} (Chall: ${e.is_challenge})`));
}

console.log("\n--- DIAGNOSTICS COMPLETE ---");
