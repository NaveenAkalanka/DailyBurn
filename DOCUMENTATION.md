# DailyBurn Documentation

## 1. Project Overview

**Project Name:** DailyBurn

**What the Software Does:**
DailyBurn is a scientifically grounded, Progressive Web App (PWA) designed for calisthenics and conditioning athletes. It generates personalized, periodized workout plans based on the user's schedule, equipment, and fitness level. It focuses on the three biological energy systems (Phosphagen, Glycolytic, Oxidative) to build a complete athlete.

**Why We Built It:**
To democratize sports science. Most fitness apps rely on generic templates or "AI" hallucinations that lack physiological validity. DailyBurn uses deterministic algorithms based on proven principles of Undulating Periodization and biomechanics to ensure safe, effective, and sustainable progression without a personal trainer.

**Key Features:**
*   **Scientific Periodization:** Automatically cycles intensity and volume.
*   **3 Energy Systems:** Targeted training for Power, Hypertrophy, and Endurance.
*   **Safety Funnel:** Locks advanced moves behind prerequisites to prevent injury.
*   **Zero-Excuses Logic:** Adapts to "No Equipment", "Quiet Mode", or injuries (e.g., "Wrist Pain").
*   **Gamified Progression:** Boss Battles and level-up mechanics.

---

## 2. System Requirements

**Supported OS:**
*   **Web:** Modern Browsers (Chrome, Safari, Edge, Firefox).
*   **Mobile:** Android (6.0+) and iOS (13.0+).

**Minimum Hardware:**
*   Any device capable of running a modern web browser.
*   Internet connection (for initial load; offline capable thereafter).

**Required Software:**
*   None for end-users.

---

## 3. Installation

**Android:**
1.  Download the **APK** from the [GitHub Release](https://github.com/NaveenAkalanka/DailyBurn/releases).
2.  Open the file on your Android device.
3.  Allow "Install from Unknown Sources" if prompted.
4.  Install and launch "DailyBurn".

**iOS:**
*   *Coming Soon to the App Store.*
*   Currently available via Web (PWA): Open in Safari -> Share -> "Add to Home Screen".

**Web / Developer Setup:**
1.  Clone the repository: `git clone https://github.com/NaveenAkalanka/DailyBurn.git`
2.  Install dependencies: `npm install`
3.  Run locally: `npm run dev`

---

## 4. How It Works (High Level)

**Overall Workflow:**
1.  **Onboarding:** User inputs inputs (Days, Time, Level, Limits).
2.  **Generation:** The `ScienceEngine` constructs a weekly micro-cycle.
3.  **Execution:** User performs workouts; data is logged.
4.  **Adaptation:** The system adjusts future volume based on consistency.

**Data Flow:**
Input (User Profile) → `generator.js` (Math Logic) → `DayDetail.jsx` (Rendering) → `storage.js` (Persistence)

---

## 5. Features & Usage

### Smart Workout Generator
*   **What it does:** Creates a unique plan for the week based on available training days.
*   **How to use:** Go to Settings -> "Reset Plan" or complete Onboarding. Select your days (e.g., M/W/F).
*   **Example:** Selecting "Monday, Wednesday" will generate a "Power" session and a "Metabolic Burn" session automatically.

### Live Workout Mode
*   **What it does:** Guides you through exercises with timers and audio cues.
*   **How to use:** Tap a day card -> "Start Experience".
*   **Example:** The app counts down your 45s work intervals and 15s rest intervals in a circuit.

### The Safety Funnel
*   **What it does:** Swaps dangerous exercises for safer variants if you are a Beginner.
*   **How to use:** Select "Beginner" in onboarding.
*   **Example:** "Pistol Squats" (High Risk) are automatically replaced with "Box Squats" until you reach "Advanced" level.

---

## 6. Configuration

**Settings Page:**
*   Accessed via the Gear icon in the navigation bar.
*   **Theme:** Light / Dark / Auto.
*   **Data Management:** clear all data or export logs.

**Default Values:**
*   **Duration:** 30 minutes.
*   **Level:** Intermediate.
*   **Theme:** System Default.

---

## 7. Error Handling & Troubleshooting

**Common Issues:**
*   **App Crash on Old Devices:** Ensure Android System WebView is up to date.
*   **"Plan Not Generating":** You may have selected 0 days. Select at least 1 day.
*   **Storage Full:** The app stores logs in `localStorage`. Clear cache if sluggish (rare).

**Quick Fix:**
*   Go to Settings -> "Danger Zone" -> "Reset Application" to wipe corrupt local data.

---

## 8. Limitations

**Constraints:**
*   **No Cloud Sync (Yet):** Data is stored locally on the device. Deleting the app deletes history.
*   **No Wearable Integration:** Does not sync with Apple Health or Google Fit currently.

---

## 9. Future Ideas

*   **Cloud Account:** Backup and sync across devices.
*   **Social Features:** Leaderboards for "Boss Battles".
*   **Wearable Support:** Heart-rate monitor integration via Bluetooth.
*   **Custom Builder:** Allowing users to manually swap specific exercises permanently.

---

## 10. License & Usage

See `LICENSE.txt` for legal details.

**Summary:**
This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** License.

*   ✅ **Share:** Copy and redistribute.
*   ✅ **Adapt:** Remix and build upon.
*   ❌ **NonCommercial:** You cannot sell this app.
*   🔄 **ShareAlike:** Derivative works must use the same license.
