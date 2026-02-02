const EXERCISE_LIBRARY = [
    // --- BEGINNER ---
    // Lower Body
    {
        id: "bg_squat", name: "Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 8, oxidative: 5 }
    },
    {
        id: "bg_lunge_fwd", name: "Forward Lunges",
        category: "strength", pattern: "Legs", sub_pattern: "Lunge", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 9, oxidative: 5 }
    },
    {
        id: "bg_lunge_rev", name: "Reverse Lunges",
        category: "strength", pattern: "Legs", sub_pattern: "Lunge", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 9, oxidative: 5 }
    },
    {
        id: "bg_lunge_walk", name: "Walking Lunges",
        category: "strength", pattern: "Legs", sub_pattern: "Lunge", level: "Beginner", progression_index: 11,
        requirements: ["Space"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 10, oxidative: 6 }
    },
    {
        id: "bg_glute_bridge", name: "Glute Bridges",
        category: "strength", pattern: "Legs", sub_pattern: "Hinge", level: "Beginner", progression_index: 10,
        requirements: ["Floor"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 7, oxidative: 4 }
    },
    {
        id: "bg_calf_raise", name: "Calf Raises",
        category: "strength", pattern: "Legs", sub_pattern: "Calf", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 2.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 6, oxidative: 3 }
    },
    {
        id: "bg_side_lunge", name: "Side Lunges",
        category: "strength", pattern: "Legs", sub_pattern: "Lunge", level: "Beginner", progression_index: 12,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 8, oxidative: 5 }
    },
    {
        id: "bg_good_morning", name: "Good Mornings",
        category: "strength", pattern: "Legs", sub_pattern: "Hinge", level: "Beginner", progression_index: 11,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 7, oxidative: 4 }
    },
    {
        id: "bg_box_squat", name: "Box Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Beginner", progression_index: 9,
        requirements: ["Box/Chair"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 7, oxidative: 4 }
    },
    {
        id: "bg_step_up", name: "Step Ups",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Beginner", progression_index: 11,
        requirements: ["Step/Box"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 9, oxidative: 6 }
    },

    // Upper Body
    {
        id: "bg_push_incline", name: "Incline Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Beginner", progression_index: 10,
        requirements: ["Elevated Surface"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 8, oxidative: 4 }
    },
    {
        id: "bg_push_wall", name: "Wall Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Beginner", progression_index: 5,
        requirements: ["Wall"], timing: { seconds_per_rep: 2.5, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 6, oxidative: 3 }
    },
    {
        id: "bg_pull_neg", name: "Negative Pull-ups",
        category: "strength", pattern: "Pull", sub_pattern: "Vertical", level: "Beginner", progression_index: 15,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 5.0, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 8, oxidative: 2 }
    },
    {
        id: "bg_pull_assist", name: "Assisted Pull-ups",
        category: "strength", pattern: "Pull", sub_pattern: "Vertical", level: "Beginner", progression_index: 12,
        requirements: ["Band/Chair", "Pull-up Bar"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 8, oxidative: 3 }
    },
    {
        id: "bg_row_incline", name: "Incline Rows",
        category: "strength", pattern: "Pull", sub_pattern: "Horizontal", level: "Beginner", progression_index: 10,
        requirements: ["Low Bar/Table"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 8, oxidative: 4 }
    },
    {
        id: "bg_scap_pull", name: "Scapular Pull-ups",
        category: "struct", pattern: "Pull", sub_pattern: "Vertical", level: "Beginner", progression_index: 8,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 2.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 5, oxidative: 2 }
    },
    {
        id: "bg_bench_dip", name: "Bench Dips",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Beginner", progression_index: 10,
        requirements: ["Chair/Bench"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 9, oxidative: 4 }
    },

    // Core
    {
        id: "bg_plank", name: "Plank",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Extension", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 1.0, is_static: true }, // 1s per 'rep' for static logic
        system_affinity: { phosphagen: 1, glycolytic: 7, oxidative: 7 }
    },
    {
        id: "bg_plank_knee", name: "Knee Plank",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Extension", level: "Beginner", progression_index: 5,
        requirements: ["None"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 1, glycolytic: 5, oxidative: 5 }
    },
    {
        id: "bg_plank_side", name: "Side Plank",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Lateral", level: "Beginner", progression_index: 12,
        requirements: ["None"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 1, glycolytic: 6, oxidative: 6 }
    },
    {
        id: "bg_crunches", name: "Crunches",
        category: "strength", pattern: "Core", sub_pattern: "Flexion", level: "Beginner", progression_index: 8,
        requirements: ["None"], timing: { seconds_per_rep: 2.5, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 8, oxidative: 3 }
    },
    {
        id: "bg_leg_raise_ground", name: "Lying Leg Raises",
        category: "strength", pattern: "Core", sub_pattern: "Flexion", level: "Beginner", progression_index: 12,
        requirements: ["Floor"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 9, oxidative: 4 }
    },
    {
        id: "bg_russ_twist", name: "Russian Twists",
        category: "strength", pattern: "Core", sub_pattern: "Rotation", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 2.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 8, oxidative: 4 }
    },
    {
        id: "bg_bird_dog", name: "Bird-Dog",
        category: "struct", pattern: "Core", sub_pattern: "Anti-Rotation", level: "Beginner", progression_index: 8,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 5, oxidative: 3 }
    },
    {
        id: "bg_dead_bug", name: "Dead Bug",
        category: "struct", pattern: "Core", sub_pattern: "Anti-Extension", level: "Beginner", progression_index: 8,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 6, oxidative: 3 }
    },

    // Full Body
    {
        id: "bg_jump_jack", name: "Jumping Jacks",
        category: "cardio", pattern: "Full Body", sub_pattern: "Cardio", level: "Beginner", progression_index: 5,
        requirements: ["None"], timing: { seconds_per_rep: 1.5, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 6, oxidative: 9 }
    },
    {
        id: "bg_burpee_mod", name: "Burpees (No Push-up)",
        category: "cardio", pattern: "Full Body", sub_pattern: "Cardio", level: "Beginner", progression_index: 15,
        requirements: ["None"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 5, glycolytic: 9, oxidative: 6 }
    },
    {
        id: "bg_inchworm", name: "Inchworm",
        category: "struct", pattern: "Full Body", sub_pattern: "Mobility", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 5.0, is_static: false },
        system_affinity: { phosphagen: 1, glycolytic: 5, oxidative: 4 }
    },
    {
        id: "bg_high_knees", name: "High Knees",
        category: "cardio", pattern: "Full Body", sub_pattern: "Cardio", level: "Beginner", progression_index: 10,
        requirements: ["None"], timing: { seconds_per_rep: 0.8, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 8, oxidative: 8 }
    },
    {
        id: "bg_butt_kicks", name: "Butt Kicks",
        category: "cardio", pattern: "Full Body", sub_pattern: "Cardio", level: "Beginner", progression_index: 8,
        requirements: ["None"], timing: { seconds_per_rep: 0.8, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 7, oxidative: 7 }
    },
    {
        id: "bg_mountain_climber", name: "Mountain Climbers",
        category: "cardio", pattern: "Full Body", sub_pattern: "Cardio", level: "Beginner", progression_index: 12,
        requirements: ["None"], timing: { seconds_per_rep: 1.0, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 9, oxidative: 5 }
    },
    {
        id: "bg_bear_crawl", name: "Bear Crawls",
        category: "struct", pattern: "Full Body", sub_pattern: "Locomotion", level: "Beginner", progression_index: 12,
        requirements: ["Space"], timing: { seconds_per_rep: 2.0, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 7, oxidative: 4 }
    },

    // --- INTERMEDIATE ---
    // Lower Body
    {
        id: "int_jump_squat", name: "Jump Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Intermediate", progression_index: 30,
        requirements: ["None"], timing: { seconds_per_rep: 2.5, is_static: false },
        system_affinity: { phosphagen: 7, glycolytic: 7, oxidative: 2 }
    },
    {
        id: "int_bulg_split", name: "Bulgarian Split Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Intermediate", progression_index: 35,
        requirements: ["Bench/Chair"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 9, oxidative: 4 }
    },
    {
        id: "int_pistol_prog", name: "Assisted Pistol Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Intermediate", progression_index: 40,
        requirements: ["Support"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 5, glycolytic: 8, oxidative: 3 }
    },
    {
        id: "int_shrimp", name: "Shrimp Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Intermediate", progression_index: 38,
        requirements: ["None"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 8, oxidative: 3 }
    },
    {
        id: "int_cossack", name: "Cossack Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Lunge", level: "Intermediate", progression_index: 32,
        requirements: ["None"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 8, oxidative: 4 }
    },
    {
        id: "int_side_jump", name: "Side-to-Side Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Intermediate", progression_index: 30,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 9, oxidative: 4 }
    },

    // Upper Body
    {
        id: "int_push_std", name: "Standard Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Intermediate", progression_index: 26,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 9, oxidative: 4 }
    },
    {
        id: "int_push_decline", name: "Decline Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Intermediate", progression_index: 32,
        requirements: ["Elevated Surface"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 9, oxidative: 3 }
    },
    {
        id: "int_push_diamond", name: "Diamond Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Intermediate", progression_index: 34,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 9, oxidative: 3 }
    },
    {
        id: "int_push_pike", name: "Pike Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Intermediate", progression_index: 36,
        requirements: ["None"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 5, glycolytic: 8, oxidative: 2 }
    },
    {
        id: "int_pull_std", name: "Standard Pull-ups",
        category: "strength", pattern: "Pull", sub_pattern: "Vertical", level: "Intermediate", progression_index: 40,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 6, glycolytic: 8, oxidative: 2 }
    },
    {
        id: "int_chin_up", name: "Chin-ups",
        category: "strength", pattern: "Pull", sub_pattern: "Vertical", level: "Intermediate", progression_index: 38,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 5, glycolytic: 8, oxidative: 2 }
    },
    {
        id: "int_aus_pull", name: "Australian Pull-ups",
        category: "strength", pattern: "Pull", sub_pattern: "Horizontal", level: "Intermediate", progression_index: 28,
        requirements: ["Low Bar"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 8, oxidative: 4 }
    },
    {
        id: "int_dips", name: "Parallel Bar Dips",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Intermediate", progression_index: 42,
        requirements: ["Parallel Bars"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 5, glycolytic: 9, oxidative: 2 }
    },
    {
        id: "int_push_close", name: "Close-Grip Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Intermediate", progression_index: 30,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 9, oxidative: 4 }
    },

    // Core
    {
        id: "int_hollow_hold", name: "Hollow Body Hold",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Extension", level: "Intermediate", progression_index: 35,
        requirements: ["None"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 2, glycolytic: 8, oxidative: 4 }
    },
    {
        id: "int_rev_plank", name: "Reverse Plank",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Flexion", level: "Intermediate", progression_index: 30,
        requirements: ["None"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 2, glycolytic: 7, oxidative: 5 }
    },
    {
        id: "int_plank_raise", name: "Plank w/ Leg Raise",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Extension", level: "Intermediate", progression_index: 32,
        requirements: ["None"], timing: { seconds_per_rep: 2.0, is_static: false }, // Dynamic version
        system_affinity: { phosphagen: 2, glycolytic: 8, oxidative: 4 }
    },
    {
        id: "int_bicycle", name: "Bicycle Crunches",
        category: "strength", pattern: "Core", sub_pattern: "Rotation", level: "Intermediate", progression_index: 28,
        requirements: ["None"], timing: { seconds_per_rep: 1.5, is_static: false },
        system_affinity: { phosphagen: 2, glycolytic: 9, oxidative: 5 }
    },
    {
        id: "int_hang_knee", name: "Hanging Knee Raises",
        category: "strength", pattern: "Core", sub_pattern: "Flexion", level: "Intermediate", progression_index: 36,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 8, oxidative: 3 }
    },
    {
        id: "int_lsit_tuck", name: "Tuck L-Sit",
        category: "strength", pattern: "Core", sub_pattern: "Flexion", level: "Intermediate", progression_index: 40,
        requirements: ["Parallettes/Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 3, glycolytic: 8, oxidative: 2 }
    },

    // Full Body
    {
        id: "int_burpee", name: "Standard Burpees",
        category: "cardio", pattern: "Full Body", sub_pattern: "Callisthenic", level: "Intermediate", progression_index: 40,
        requirements: ["None"], timing: { seconds_per_rep: 4.5, is_static: false },
        system_affinity: { phosphagen: 6, glycolytic: 10, oxidative: 5 }
    },
    {
        id: "int_box_jump", name: "Box Jumps",
        category: "power", pattern: "Legs", sub_pattern: "Explosive", level: "Intermediate", progression_index: 38,
        requirements: ["Box"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "int_tuck_jump", name: "Tuck Jumps",
        category: "power", pattern: "Legs", sub_pattern: "Explosive", level: "Intermediate", progression_index: 35,
        requirements: ["None"], timing: { seconds_per_rep: 2.0, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 5, oxidative: 2 }
    },
    {
        id: "int_mtn_twist", name: "Mountain Climber Twists",
        category: "cardio", pattern: "Full Body", sub_pattern: "Cardio", level: "Intermediate", progression_index: 32,
        requirements: ["None"], timing: { seconds_per_rep: 1.2, is_static: false },
        system_affinity: { phosphagen: 4, glycolytic: 9, oxidative: 6 }
    },

    // --- ADVANCED ---
    // Lower Body
    {
        id: "adv_pistol", name: "Pistol Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Advanced", progression_index: 60,
        requirements: ["None"], timing: { seconds_per_rep: 4.5, is_static: false },
        system_affinity: { phosphagen: 6, glycolytic: 6, oxidative: 2 }
    },
    {
        id: "adv_nordic", name: "Nordic Curls",
        category: "strength", pattern: "Legs", sub_pattern: "Hinge", level: "Advanced", progression_index: 65,
        requirements: ["Anchor"], timing: { seconds_per_rep: 5.0, is_static: false },
        system_affinity: { phosphagen: 7, glycolytic: 5, oxidative: 1 }
    },
    {
        id: "adv_sl_dead", name: "Single-Leg Deadlift",
        category: "strength", pattern: "Legs", sub_pattern: "Hinge", level: "Advanced", progression_index: 55,
        requirements: ["None"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 7, oxidative: 3 }
    },
    {
        id: "adv_sissy", name: "Sissy Squats",
        category: "strength", pattern: "Legs", sub_pattern: "Squat", level: "Advanced", progression_index: 58,
        requirements: ["None"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 5, glycolytic: 7, oxidative: 2 }
    },
    {
        id: "adv_shrimp_jump", name: "Shrimp Squat Jumps",
        category: "power", pattern: "Legs", sub_pattern: "Explosive", level: "Advanced", progression_index: 68,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 6, oxidative: 1 }
    },

    // Upper Body
    {
        id: "adv_push_onearm_prog", name: "One-Arm Push-up (Asst)",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Advanced", progression_index: 65,
        requirements: ["None"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 7, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "adv_planche_lean", name: "Planche Leans",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Advanced", progression_index: 55,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 5, glycolytic: 7, oxidative: 2 }
    },
    {
        id: "adv_tuck_planche", name: "Tuck Planche",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Advanced", progression_index: 68,
        requirements: ["Parallettes/Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 7, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "adv_hspu_wall", name: "Wall Handstand Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Advanced", progression_index: 62,
        requirements: ["Wall"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 7, glycolytic: 7, oxidative: 1 }
    },
    {
        id: "adv_onearm_pull_prog", name: "Archer Pull-ups",
        category: "strength", pattern: "Pull", sub_pattern: "Vertical", level: "Advanced", progression_index: 65,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 7, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "adv_muscle_up", name: "Muscle-Ups",
        category: "power", pattern: "Pull", sub_pattern: "Explosive", level: "Advanced", progression_index: 70,
        requirements: ["Bar/Rings"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "adv_front_lever_prog", name: "Front Lever Tuck",
        category: "strength", pattern: "Pull", sub_pattern: "Horizontal", level: "Advanced", progression_index: 60,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 6, glycolytic: 7, oxidative: 1 }
    },
    {
        id: "adv_back_lever_prog", name: "Back Lever Tuck",
        category: "strength", pattern: "Pull", sub_pattern: "Horizontal", level: "Advanced", progression_index: 58,
        requirements: ["Pull-up Bar"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 6, glycolytic: 7, oxidative: 1 }
    },

    // Core
    {
        id: "adv_dragon_flag", name: "Dragon Flags",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Extension", level: "Advanced", progression_index: 65,
        requirements: ["Bench/Floor"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 7, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "adv_lsit_full", name: "L-Sit",
        category: "strength", pattern: "Core", sub_pattern: "Flexion", level: "Advanced", progression_index: 55,
        requirements: ["Parallettes/Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 5, glycolytic: 8, oxidative: 1 }
    },
    {
        id: "adv_vsit", name: "V-Sit",
        category: "strength", pattern: "Core", sub_pattern: "Flexion", level: "Advanced", progression_index: 62,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 6, glycolytic: 7, oxidative: 1 }
    },
    {
        id: "adv_plank_alt", name: "Plank w/ Arm & Leg Raise",
        category: "struct", pattern: "Core", sub_pattern: "Anti-Rotation", level: "Advanced", progression_index: 52,
        requirements: ["None"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 3, glycolytic: 7, oxidative: 3 }
    },
    {
        id: "adv_flag_prog", name: "Human Flag (Tuck)",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Lateral", level: "Advanced", progression_index: 70,
        requirements: ["Vertical Pole"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 8, glycolytic: 5, oxidative: 1 }
    },

    // Full Body
    {
        id: "adv_hs_free", name: "Freestanding Handstand",
        category: "skill", pattern: "Full Body", sub_pattern: "Balance", level: "Advanced", progression_index: 60,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 4, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "adv_hs_walk", name: "Handstand Walks",
        category: "skill", pattern: "Full Body", sub_pattern: "Balance", level: "Advanced", progression_index: 65,
        requirements: ["Floor"], timing: { seconds_per_rep: 2.0, is_static: false },
        system_affinity: { phosphagen: 6, glycolytic: 6, oxidative: 2 }
    },
    {
        id: "adv_burpee_tuck", name: "Burpees w/ Tuck Jump",
        category: "cardio", pattern: "Full Body", sub_pattern: "Explosive", level: "Advanced", progression_index: 55,
        requirements: ["None"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 8, glycolytic: 9, oxidative: 4 }
    },
    {
        id: "adv_box_jump_high", name: "High Box Jumps",
        category: "power", pattern: "Legs", sub_pattern: "Explosive", level: "Advanced", progression_index: 60,
        requirements: ["High Box"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 10, glycolytic: 3, oxidative: 1 }
    },

    // --- EXPERT ---
    // Lower Body
    {
        id: "exp_calf_one", name: "One-Legged Calf Raises",
        category: "strength", pattern: "Legs", sub_pattern: "Calf", level: "Expert", progression_index: 76,
        requirements: ["None"], timing: { seconds_per_rep: 3.0, is_static: false },
        system_affinity: { phosphagen: 3, glycolytic: 8, oxidative: 2 }
    },
    {
        id: "exp_side_jump_sq", name: "Side-to-Side Jump Squats",
        category: "power", pattern: "Legs", sub_pattern: "Explosive", level: "Expert", progression_index: 80,
        requirements: ["None"], timing: { seconds_per_rep: 2.5, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 8, oxidative: 2 }
    },
    {
        id: "exp_plyo_push_squat", name: "Plyo Push-up to Squat",
        category: "power", pattern: "Full Body", sub_pattern: "Explosive", level: "Expert", progression_index: 85,
        requirements: ["None"], timing: { seconds_per_rep: 3.5, is_static: false },
        system_affinity: { phosphagen: 10, glycolytic: 7, oxidative: 2 }
    },

    // Upper Body
    {
        id: "exp_push_onearm", name: "One-Arm Push-up",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Expert", progression_index: 85,
        requirements: ["Floor"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 8, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "exp_planche", name: "Full Planche",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Expert", progression_index: 95,
        requirements: ["Floor/Parallettes"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 9, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "exp_pull_onearm", name: "One-Arm Pull-up",
        category: "strength", pattern: "Pull", sub_pattern: "Vertical", level: "Expert", progression_index: 95,
        requirements: ["Bar"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "exp_iron_cross", name: "Iron Cross",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Expert", progression_index: 98,
        requirements: ["Rings"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 9, glycolytic: 3, oxidative: 1 }
    },
    {
        id: "exp_vic_cross", name: "Victorian Cross",
        category: "strength", pattern: "Pull", sub_pattern: "Horizontal", level: "Expert", progression_index: 99,
        requirements: ["Parallel Bars"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 10, glycolytic: 2, oxidative: 1 }
    },

    // Core
    {
        id: "exp_human_flag", name: "Full Human Flag",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Lateral", level: "Expert", progression_index: 90,
        requirements: ["Pole"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 9, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "exp_front_lever", name: "Full Front Lever",
        category: "strength", pattern: "Pull", sub_pattern: "Horizontal", level: "Expert", progression_index: 88,
        requirements: ["Bar"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 8, glycolytic: 5, oxidative: 1 }
    },
    {
        id: "exp_back_lever", name: "Full Back Lever",
        category: "strength", pattern: "Pull", sub_pattern: "Horizontal", level: "Expert", progression_index: 86,
        requirements: ["Bar"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 8, glycolytic: 5, oxidative: 1 }
    },
    {
        id: "exp_deg_push", name: "90 Degree Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Expert", progression_index: 92,
        requirements: ["Floor/Parallettes"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 5, oxidative: 1 }
    },

    // Full Body & Challenge
    {
        id: "exp_hspu_free", name: "Freestanding HSPU",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Expert", progression_index: 90,
        requirements: ["Floor"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 9, glycolytic: 5, oxidative: 1 }
    },
    {
        id: "exp_hs_pirouette", name: "Handstand Pirouettes",
        category: "skill", pattern: "Full Body", sub_pattern: "Balance", level: "Expert", progression_index: 93,
        requirements: ["Floor"], timing: { seconds_per_rep: 5.0, is_static: false },
        system_affinity: { phosphagen: 6, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "exp_hs_one", name: "One-Arm Handstand",
        category: "skill", pattern: "Full Body", sub_pattern: "Balance", level: "Expert", progression_index: 96,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 8, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "chal_crow", name: "Crow Pose",
        category: "skill", pattern: "Full Body", sub_pattern: "Balance", level: "Expert", progression_index: 80,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 4, glycolytic: 6, oxidative: 1 }
    },
    {
        id: "chal_headstand", name: "Headstand",
        category: "skill", pattern: "Full Body", sub_pattern: "Balance", level: "Expert", progression_index: 78,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 3, glycolytic: 5, oxidative: 2 }
    },
    {
        id: "chal_elbow_lev", name: "Elbow Lever",
        category: "skill", pattern: "Full Body", sub_pattern: "Balance", level: "Expert", progression_index: 82,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 5, glycolytic: 5, oxidative: 1 }
    },
    {
        id: "chal_side_lev", name: "Side Lever / Human Flag",
        category: "strength", pattern: "Core", sub_pattern: "Anti-Lateral", level: "Expert", progression_index: 90,
        requirements: ["Pole"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 9, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "chal_manna", name: "Manna",
        category: "skill", pattern: "Core", sub_pattern: "Flexion", level: "Expert", progression_index: 97,
        requirements: ["Floor"], timing: { seconds_per_rep: 1.0, is_static: true },
        system_affinity: { phosphagen: 8, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "chal_mu_fl", name: "Muscle-up to Front Lever",
        category: "power", pattern: "Pull", sub_pattern: "Complex", level: "Expert", progression_index: 94,
        requirements: ["Bar/Rings"], timing: { seconds_per_rep: 6.0, is_static: false },
        system_affinity: { phosphagen: 10, glycolytic: 5, oxidative: 1 }
    },
    {
        id: "chal_planche_push", name: "Planche Push-ups",
        category: "strength", pattern: "Push", sub_pattern: "Horizontal", level: "Expert", progression_index: 99,
        requirements: ["Floor"], timing: { seconds_per_rep: 4.0, is_static: false },
        system_affinity: { phosphagen: 10, glycolytic: 4, oxidative: 1 }
    },
    {
        id: "chal_imp_dip", name: "Impossible Dips",
        category: "strength", pattern: "Push", sub_pattern: "Vertical", level: "Expert", progression_index: 100,
        requirements: ["Parallel Bars"], timing: { seconds_per_rep: 5.0, is_static: false },
        system_affinity: { phosphagen: 10, glycolytic: 3, oxidative: 1 }
    }
];
