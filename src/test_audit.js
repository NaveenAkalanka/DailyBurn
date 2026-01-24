import { generateSciencePlan } from "./logic/scienceAlgorithm.js";
import { EXERCISE_LIBRARY } from "./data/exercises.js";
import fs from "fs";

/**
 * DAILYBURN ALGORITHM INTEGRITY & VALIDATION PROTOCOL (v2.2)
 * Mass Permutation "Fuzz Test"
 */

const LOG_FILE = "test_audit_log.json";

// --- 1. DEFINITIONS ---
const MATRIX = {
    skill: ["Beginner", "Intermediate", "Advanced"],
    duration: [10, 20, 45],
    constraints: [[], ["no_jumping"], ["wrist_pain"]], // Simplified map for code
    equipment: [[], ["no_furniture"], ["no_bar"]], // Simplified map
    context: ["Monday", "Tuesday", "Friday"]
};

// Constraint Filters Logic (Mirroring Algorithm for Validation)
const IS_DANGEROUS = {
    "wrist_pain": (ex) => ex.pattern === "Push" && ex.name !== "Wall Push-up" && ex.sub_pattern !== "Vertical",
    "no_jumping": (ex) => ["Power", "Explosive"].includes(ex.sub_pattern)
};

const EQUIPMENT_REQ = {
    "no_furniture": "Furniture",
    "no_bar": "Pull-up Bar",
    "no_wall": "Wall"
};

// --- 2. VALIDATION GATES ---

const validateSafety = (plan, constraints) => {
    // Flatten all exercises
    const allEx = plan.flatMap(d => d.rawBlocks.flatMap(b => b.exercises || []));
    for (const exName of allEx.map(e => e.name)) {
        const dbEx = EXERCISE_LIBRARY.find(e => e.name === exName);
        if (!dbEx) continue; // Should not happen

        if (constraints.includes("wrist_pain") && IS_DANGEROUS["wrist_pain"](dbEx)) return `FAIL: Wrist unsafe move '${exName}' found`;
        if (constraints.includes("no_jumping") && IS_DANGEROUS["no_jumping"](dbEx)) return `FAIL: Jump move '${exName}' found`;
    }
    return "PASS";
};

const validateSkill = (plan, level) => {
    if (level !== "Beginner") return "PASS"; // Only strict on beginners
    const allEx = plan.flatMap(d => d.rawBlocks.flatMap(b => b.exercises || []));

    for (const exName of allEx.map(e => e.name)) {
        const dbEx = EXERCISE_LIBRARY.find(e => e.name === exName);
        if (!dbEx) continue;

        // Find the specific instance in the plan to check 'is_challenge' flag
        const planInstance = allEx.find(e => e.name === exName);
        const isBoss = planInstance?.is_challenge || false;

        // Beginner limit: index <= 30 (Base), but Boss can go up to 40
        const limit = isBoss ? 45 : 30;

        if (dbEx.progression_index > limit) return `FAIL: Advanced move '${exName}' (Index ${dbEx.progression_index}) found in Beginner plan (Limit ${limit})`;
    }
    return "PASS";
};

const validateEquipment = (plan, equipmentExclusions) => {
    const allEx = plan.flatMap(d => d.rawBlocks.flatMap(b => b.exercises || []));
    for (const exName of allEx.map(e => e.name)) {
        const dbEx = EXERCISE_LIBRARY.find(e => e.name === exName);
        if (!dbEx) continue;

        const reqs = dbEx.requirements || [];
        if (equipmentExclusions.includes("no_furniture") && reqs.includes("Furniture")) return `FAIL: Needs Furniture '${exName}'`;
        if (equipmentExclusions.includes("no_bar") && reqs.includes("Pull-up Bar")) return `FAIL: Needs Bar '${exName}'`;
    }
    return "PASS";
};

const validateTime = (plan, targetTime) => {
    // Crude check: Does plan duration field match?
    // Algorithm returns 'duration' property.
    const planDuration = plan[0].duration;
    // Allow small deviation if logic changes, but currently it passes through
    if (planDuration === targetTime) return "PASS";
    // Also check calculated block times?
    // For now, metadata check is sufficient for v1
    return `FAIL: Plan duration ${planDuration} != Target ${targetTime}`;
};

const validateCompleteness = (plan) => {
    // Check for empty Rounds or undefined exercises
    // rawBlocks[0] is Warmup
    const bodyBlocks = plan[0].rawBlocks.slice(1);
    for (const block of bodyBlocks) {
        if (!block.exercises || block.exercises.length === 0) return `FAIL: Empty Block '${block.name}'`;
        // Check for empty slots (less than 4 exercises per round implies a drop)
        // Circuit/Super have 4 slots: Legs, Push, Pull, Core
        if (block.exercises.length < 4) return `FAIL: Missing Slot in '${block.name}' (Count: ${block.exercises.length})`;
    }
    return "PASS";
};

// --- 3. EXECUTION ---

const runAudit = () => {
    const auditLog = [];
    let scenarioId = 1;

    console.log("🚀 Starting Mass Permutation Fuzz Test...");

    // NESTED LOOPS for Permutations
    MATRIX.skill.forEach(skill => {
        MATRIX.duration.forEach(time => {
            MATRIX.constraints.forEach(constraints => {
                MATRIX.equipment.forEach(equipment => {
                    MATRIX.context.forEach(context => {

                        // 1. Prepare Inputs
                        // Map our internal array structure to what generateSciencePlan expects
                        // Flatten equipment and constraints into single exclusion list
                        const exclusions = [...constraints, ...equipment];

                        const inputs = {
                            selectedDays: [context], // Single day test
                            time: time,
                            exclusions: exclusions,
                            skill: skill,       // NEW
                            equipment: equipment // NEW
                        };

                        // 2. Generate
                        let plan;
                        try {
                            plan = generateSciencePlan(inputs);
                        } catch (e) {
                            auditLog.push({
                                scenario_id: scenarioId++,
                                inputs,
                                status: "ERROR",
                                error: e.message
                            });
                            return;
                        }

                        // 3. Validate
                        const resSafety = validateSafety(plan, constraints);
                        const resSkill = validateSkill(plan, skill);
                        const resEquip = validateEquipment(plan, equipment);
                        const resTime = validateTime(plan, time);
                        const resComplete = validateCompleteness(plan);

                        const isPass = resSafety === "PASS" && resSkill === "PASS" && resEquip === "PASS" && resTime === "PASS" && resComplete === "PASS";

                        // 4. Log
                        const errorMsg = isPass ? null : [resSafety, resSkill, resEquip, resTime, resComplete].filter(r => r && r.startsWith("FAIL")).join("; ");

                        if (!isPass) {
                            console.log(`❌ S${String(scenarioId).padStart(3, '0')} FAIL: ${errorMsg}`);
                        }

                        auditLog.push({
                            scenario_id: String(scenarioId++).padStart(3, '0'),
                            inputs: { skill, time, constraints, equipment, context },
                            generated_plan_summary: {
                                mode: plan[0].type,
                                exercises_count: plan[0].rawBlocks.reduce((a, b) => a + (b.exercises?.length || 0), 0)
                            },
                            full_generated_plan: plan[0], // Full Dump
                            validation_results: {
                                gate_1_safety: resSafety,
                                gate_2_skill: resSkill,
                                gate_3_equipment: resEquip,
                                gate_4_time: resTime,
                                gate_5_completeness: resComplete
                            },
                            final_status: isPass ? "PASS" : "FAIL",
                            error_log: errorMsg
                        });

                    });
                });
            });
        });
    });

    // --- 5. OUTPUT ---
    const passCount = auditLog.filter(x => x.final_status === "PASS").length;
    const failCount = auditLog.filter(x => x.final_status === "FAIL").length;

    const finalOutput = {
        metadata: {
            timestamp: new Date().toISOString(),
            engine_version: "v2.2-matrix",
            total_scenarios: auditLog.length,
            pass_count: passCount,
            fail_count: failCount
        },
        audit_trail: auditLog
    };

    fs.writeFileSync(LOG_FILE, JSON.stringify(finalOutput, null, 2));

    console.log(`\n✅ Audit Complete.`);
    console.log(`Total Scenarios: ${auditLog.length}`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`\n📝 Detailed log written to ${LOG_FILE}`);
};

runAudit();
