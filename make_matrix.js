import { getDurationGuidelines } from "./src/logic/scienceAlgorithm.js";

const levels = ["Beginner", "Intermediate", "Advanced"];
const days = [1, 2, 3, 4, 5, 6, 7];

console.log("| Fitness Level | Days/Week | Ideal Time | Range (Green Zone) |");
console.log("|---|---|---|---|");

levels.forEach(level => {
    days.forEach(day => {
        const { min, max, ideal } = getDurationGuidelines(level, day);
        console.log(`| ${level.padEnd(12)} | ${day}         | **${ideal} min**   | ${min}-${max} min |`);
    });
});
