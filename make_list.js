const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'exercises.js');
const raw = fs.readFileSync(filePath, 'utf8');

// Strip export and trailing semicolon to make it eval-able
// "export const EXERCISE_LIBRARY = ["  ->  "["
// And remove the "export" part basically.
// Simple hack: find the first '[' and the last ']'
const start = raw.indexOf('[');
const end = raw.lastIndexOf(']');
const arrayString = raw.substring(start, end + 1);

// We need to handle the object keys not being quoted, which JSON.parse won't like.
// So we use eval.
// Wrap in parentheses to ensure it's treated as an expression if needed, though [...] is fine.
const data = eval(arrayString);

let output = "DAILYBURN - ALL WORKOUTS\n========================\n\n";

// Function to format Title Case
const fmt = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Group by Level
const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
levels.forEach(level => {
    output += `\n--- ${level.toUpperCase()} ---\n\n`;

    // Within level, group by Pattern (Legs, Push, Pull, Core, Full Body)
    const levelExercises = data.filter(e => e.level === level);
    const patterns = ["Legs", "Push", "Pull", "Core", "Full Body", "Warmup"];

    patterns.forEach(pat => {
        const exs = levelExercises.filter(e => e.pattern === pat);
        if (exs.length === 0) return;

        output += `  [${pat}]\n`;
        exs.forEach(ex => {
            output += `    - ${ex.name} (${ex.sub_pattern})\n`;
            output += `      Requirements: ${ex.requirements.join(', ')}\n`;
            // Add timing info
            const timing = ex.timing.is_static ? `${ex.timing.seconds_per_rep}s hold` : `${ex.timing.seconds_per_rep}s/rep`;
            output += `      Timing: ${timing}\n\n`;
        });
    });
});

fs.writeFileSync('all_workouts.txt', output);
console.log("Successfully created all_workouts.txt");
