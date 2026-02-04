<div align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/DailyBurn-White.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/DailyBurn.svg">
    <img alt="DailyBurn Logo" src="public/DailyBurn.svg" width="120" height="120">
  </picture>

  # DailyBurn
  
  **Democratizing Sports Science**

  <p>
    <a href="#-core-philosophy">Philosophy</a> •
    <a href="#-download-app">Download</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg)](https://tailwindcss.com/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-Mobile-blue)](https://capacitorjs.com/)
  <br />
  <a href="https://www.buymeacoffee.com/naveenakalanka" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

</div>

<br />

> **Elite Concepts. Simple Execution.** 
> Use the same training principles as pro athletes (Periodization, Energy Systems) without needing a PhD. The app handles the math; you just handle the sweat.

---

## 📲 Download App

Experience DailyBurn on your Android device.

<a href="./app-releases/android/DailyBurn.apk">
  <img alt="Get it on GitHub" src="https://img.shields.io/badge/Android-APK_Ready-3DDC84?style=for-the-badge&logo=android&logoColor=white" />
</a>

> **iOS Version**: Coming to the App Store soon!

---

## 🧬 Core Philosophy

### 1. The 3 Fuel Tanks (Energy Systems)
Your body isn't just one engine. To build a complete athlete, we target all three biological energy pathways:
- ⚡ **Phosphagen (System 1)**: Explosive power (1-10s).
- 🔥 **Glycolytic (System 2)**: High-intensity "burn" (30s-2m).
- 🫀 **Oxidative (System 3)**: Endurance and recovery.

### 2. Zero-Excuses Architecture
We eliminate every barrier to entry.
- **Wrist Pain?** -> We swap to knuckle/forearm variants.
- **No Equipment?** -> We generate "Furniture" or "Floor-only" plans.
- **No Time?** -> "High-Density Circuits" give you a full workout in 15 mins.

### 3. Gamified Consistency
Doing pushups is boring. **Leveling up gives you dopamine.**
- **Variation Matrix**: We change the movement pattern every round to keep your brain engaged.
- **Boss Battles**: End every session with a challenge to test your limits.

### 4. Safety & Progression (The Safety Funnel)
Visualizing progression ensures you never plateau.
- **The Safety Funnel**: Beginners are protected from dangerous moves until they earn the right stats.
- **Real-World Values**: Rep counts are mathematically calculated based on human speed, not random numbers.

---

## 🤖 Why No AI?

**Math > Hallucinations.**
Most "AI" fitness apps generate random workouts that *look* coherent but lack physiological structure. 

**DailyBurn is different.**
We use deterministic, physiological algorithms. We know exactly *why* a set is 12 reps and not 15 (Time Under Tension). We rely on **Sports Science**, not Large Language Models.

---

## 📉 Algorithm Visualizer

Want to see the engine under the hood?
We've included a standalone tool to visualize how our periodization logic works.

👉 **[View Algorithm Visualizer](./algorithm_visualizer)**

Open `algorithm_visualizer/index.html` to play with the parameters and see how the app constructs training blocks in real-time.

## 🛠️ Tech Stack

- **Frontend**: React (v18)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Animations
- **Mobile Runtime**: Capacitor (Android & iOS)
- **Icons**: React Icons (Material Design)
- **Charts**: Recharts for progress visualization
- **State/Logic**: Context API + Custom Hooks

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NaveenAkalanka/DailyBurn.git
    cd DailyBurn
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # For native mobile plugins
    npm i @capacitor/preferences @capacitor/core
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open locally**
    Visit `http://localhost:5173` in your browser.

## 📱 Mobile Build

DailyBurn is ready for mobile!

```bash
# Build the web assets
npm run build

# Sync with native projects
npx cap sync

# Open Android Studio
npx cap open android

# Open Xcode (Mac only)
npx cap open ios
```

<br />

<div align="center">
  <p class="text-sm text-gray-500">
    Designed & Developed with ❤️ by <a href="https://github.com/NaveenAkalanka">Naveen Akalanka</a>
    <br />
    <a href="https://www.buymeacoffee.com/naveenakalanka">Support the Project ☕</a>
  </p>
</div>

<br />

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** License.

You are free to:
*   **Share** — Copy and redistribute the material in any medium or format.
*   **Adapt** — Remix, transform, and build upon the material.

**Under the following terms:**
*   **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
*   **NonCommercial** — You may not use the material for commercial purposes.
*   **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

See [LICENSE](LICENSE) for the full text.
