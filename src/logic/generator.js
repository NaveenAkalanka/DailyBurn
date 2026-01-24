import { generateSciencePlan } from "./scienceAlgorithm";
import { EXERCISE_LIBRARY } from "../data/exercises";

/**
 * GENERATOR PROXY
 * Redirects legacy calls to the new Science Engine.
 */

// Legacy helper, simplified just to support legacy calls if any component uses it directly
export function getAvailableExercises(exclusions = []) {
    // This logic is now inside scienceAlgorithm, but checking EXERCISE_LIBRARY directly here for safety
    return EXERCISE_LIBRARY.filter(ex => {
        if (exclusions.includes("no_bar") && ex.equipmentRequirement === "bar") return false;
        if (exclusions.includes("no_furniture") && ex.equipmentRequirement === "furniture") return false;
        return true;
    });
}

export function generatePlan(inputs) {
    // Forward directly to the new engine
    return generateSciencePlan(inputs);
}
