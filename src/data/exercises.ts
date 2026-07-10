import type { Day, Tip, ScheduleRow, PrehabExercise, TimelineEntry } from '../types';

export const days: Day[] = [
  {
    id: 0,
    label: 'MON',
    name: 'LOWER A',
    subtitle: 'Squat · Split Squat · Posterior Chain',
    color: '#3ACA6E',
    accent: '#5df094',
    cardio:
      'Skip elliptical today — legs are already cooked. Instead: 5–10 min easy treadmill walk (3 mph flat) to flush lactic acid and aid recovery.',
    exercises: [
      {
        id: 'back-squat',
        name: 'Barbell Back Squat',
        progressMetric: 'e1rm',
        sets: 4,
        reps: '6–8',
        rest: '90 sec',
        muscle: 'Quads / Glutes',
        notes: 'Keep chest tall, knees tracking over toes. Break parallel if mobility allows.',
        videoUrl:
          'https://www.youtube.com/results?search_query=barbell+back+squat+proper+form+jeff+nippard',
      },
      {
        id: 'bulgarian-split-squat',
        name: 'Bulgarian Split Squat',
        sets: 3,
        reps: '10 each leg',
        rest: '75 sec',
        muscle: 'Quads / Glutes',
        notes: 'Rear foot elevated on bench. Step far enough out so knee stays behind toes.',
        videoUrl:
          'https://www.youtube.com/results?search_query=bulgarian+split+squat+proper+form+tutorial',
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        sets: 3,
        reps: '10–12',
        rest: '75 sec',
        muscle: 'Quads / Glutes',
        notes: "Higher foot placement = more glutes. Don't fully lock out knees at the top.",
        videoUrl: 'https://www.youtube.com/results?search_query=leg+press+proper+form+tutorial',
      },
      {
        id: 'seated-leg-curl',
        name: 'Seated Leg Curl',
        sets: 3,
        reps: '12–15',
        rest: '60 sec',
        muscle: 'Hamstrings',
        notes: 'Slow on the way back up (2–3 sec). Hips should stay pinned to the seat.',
        videoUrl:
          'https://www.youtube.com/results?search_query=seated+leg+curl+proper+form+tutorial',
      },
      {
        id: 'calf-raise',
        name: 'Standing Calf Raise',
        sets: 3,
        reps: '15',
        rest: '60 sec',
        muscle: 'Calves',
        notes:
          'Full range of motion — all the way up, slow 3 sec lower. Complements flat feet prehab work by strengthening the tibialis posterior.',
        videoUrl:
          'https://www.youtube.com/results?search_query=standing+calf+raise+proper+form+tutorial',
      },
    ],
  },
  {
    id: 1,
    label: 'TUE',
    name: 'UPPER A',
    subtitle: 'Chest · Shoulders · Triceps',
    color: '#E8533A',
    accent: '#ff7a5c',
    cardio:
      'Elliptical: 5 min moderate pace (level 8–10). Alternatively, 5 min incline treadmill walk (3.5 mph / 10–12% incline) burns slightly more calories.',
    exercises: [
      {
        id: 'bench-press',
        name: 'Barbell Bench Press',
        progressMetric: 'e1rm',
        sets: 4,
        reps: '6–8',
        rest: '90 sec',
        muscle: 'Chest',
        notes:
          'Control the descent 2 sec down, drive up explosively. 90 sec rest keeps pace for 30 min.',
        videoUrl:
          'https://www.youtube.com/results?search_query=how+to+bench+press+proper+form+jeff+nippard',
      },
      {
        id: 'db-shoulder-press',
        name: 'Dumbbell Shoulder Press',
        sets: 3,
        reps: '10–12',
        rest: '75 sec',
        muscle: 'Shoulders',
        notes: "Seated or standing. Keep core braced, don't arch lower back.",
        videoUrl:
          'https://www.youtube.com/results?search_query=dumbbell+shoulder+press+proper+form+tutorial',
      },
      {
        id: 'cable-lateral-raise',
        name: 'Cable Lateral Raise',
        sets: 3,
        reps: '12–15',
        rest: '60 sec',
        muscle: 'Side Delts',
        notes:
          'Slight bend in elbow. Raise to shoulder height only — going higher shifts to traps.',
        videoUrl:
          'https://www.youtube.com/results?search_query=cable+lateral+raise+proper+form+jeff+nippard',
      },
      {
        id: 'tricep-pushdown',
        name: 'Tricep Rope Pushdown',
        sets: 3,
        reps: '12–15',
        rest: '60 sec',
        muscle: 'Triceps',
        notes: 'Spread the rope at the bottom for full contraction. Keep elbows pinned to sides.',
        videoUrl:
          'https://www.youtube.com/results?search_query=tricep+rope+pushdown+proper+form+tutorial',
      },
    ],
  },
  {
    id: 2,
    label: 'WED',
    name: 'LOWER B',
    subtitle: 'Deadlift · Posterior Chain · Core',
    color: '#E8A83A',
    accent: '#ffc95c',
    cardio:
      'Skip elliptical today — legs are already cooked. 5–10 min easy treadmill walk to flush lactic acid. Tomorrow is Upper B so your legs get a full day off.',
    exercises: [
      {
        id: 'deadlift',
        name: 'Conventional Deadlift',
        progressMetric: 'e1rm',
        sets: 4,
        reps: '5–6',
        rest: '90 sec',
        muscle: 'Full Posterior Chain',
        notes:
          'Hip hinge — drive the floor away. Keep bar dragging your shins. Heaviest lift of the week.',
        videoUrl:
          'https://www.youtube.com/results?search_query=conventional+deadlift+proper+form+jeff+nippard',
      },
      {
        id: 'rdl',
        name: 'Romanian Deadlift',
        sets: 3,
        reps: '10–12',
        rest: '75 sec',
        muscle: 'Hamstrings / Glutes',
        notes: 'Hinge at hips, slight bend in knees. Feel the hamstring stretch at the bottom.',
        videoUrl:
          'https://www.youtube.com/results?search_query=romanian+deadlift+proper+form+tutorial',
      },
      {
        id: 'dead-bug-woodchop',
        name: 'Superset: Dead Bug + Cable Woodchop',
        sets: 3,
        reps: '10 each side + 12 each side',
        rest: '60 sec',
        muscle: 'Core / Obliques',
        notes:
          'Do dead bugs first (anti-extension), then woodchops (rotation) back-to-back with no rest between. Dead bug: lie on back, extend opposite arm and leg keeping lower back pressed to floor. Woodchop: pull cable high to low, keep hips square.',
        videoUrl:
          'https://www.youtube.com/results?search_query=dead+bug+exercise+proper+form+tutorial',
        movements: [
          { name: 'Dead Bug', reps: '10 each side' },
          { name: 'Cable Woodchop', reps: '12 each side' },
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'THU',
    name: 'UPPER B',
    subtitle: 'Back · Biceps · Rear Delts',
    color: '#3A7DE8',
    accent: '#5c9fff',
    cardio:
      'Elliptical: 5–10 min. Thursday is a good day to push slightly harder on cardio — Friday is a rest day so your body has 48+ hrs to recover.',
    exercises: [
      {
        id: 'barbell-row',
        name: 'Barbell Row',
        progressMetric: 'e1rm',
        sets: 4,
        reps: '6–8',
        rest: '90 sec',
        muscle: 'Mid Back',
        notes: 'Hinge to ~45°, drive elbows back. Pull to your belly button, not chest.',
        videoUrl: 'https://www.youtube.com/results?search_query=barbell+row+proper+form+tutorial',
      },
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        sets: 3,
        reps: '10–12',
        rest: '75 sec',
        muscle: 'Lats',
        notes:
          "Lean back slightly, pull bar to upper chest. Don't use momentum — control the return.",
        videoUrl:
          'https://www.youtube.com/results?search_query=lat+pulldown+proper+form+tutorial',
      },
      {
        id: 'pull-ups',
        name: 'Pull-Ups or Assisted Pull-Ups',
        sets: 3,
        reps: '6–10',
        rest: '75 sec',
        muscle: 'Lats / Biceps',
        notes:
          'Dead hang at bottom, pull until chin clears bar. Use the assisted machine if needed.',
        videoUrl:
          'https://www.youtube.com/results?search_query=pull+up+proper+form+tutorial+jeff+nippard',
      },
      {
        id: 'face-pulls',
        name: 'Face Pulls',
        sets: 3,
        reps: '15–20',
        rest: '60 sec',
        muscle: 'Rear Delts',
        notes:
          "Pull to eye level, flare elbows high. Critical for shoulder health — don't skip this.",
        videoUrl:
          'https://www.youtube.com/results?search_query=face+pulls+proper+form+athlean+x',
      },
      {
        id: 'curl-skull-crusher',
        name: 'Superset: DB Curl + Skull Crusher',
        sets: 3,
        reps: '10–12 each',
        rest: '75 sec',
        muscle: 'Biceps + Triceps',
        notes:
          'Do these back-to-back with no rest between. Curl first, then skull crusher. Saves ~5 min.',
        videoUrl:
          'https://www.youtube.com/results?search_query=skull+crushers+lying+tricep+extension+proper+form',
        movements: [
          { name: 'DB Curl', reps: '10–12' },
          { name: 'Skull Crusher', reps: '10–12' },
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'SAT',
    name: 'HOME',
    subtitle: 'Bodyweight Push · Pull · Core',
    color: '#A63AE8',
    accent: '#c87aff',
    cardio:
      'No equipment needed — 5 min jumping jacks or a brisk walk outside to warm up before starting.',
    exercises: [
      {
        id: 'home-pull-ups',
        name: 'Pull-Ups',
        sets: 3,
        reps: '6–10',
        rest: '60 sec',
        muscle: 'Lats / Biceps',
        notes:
          'Doorway bar. Dead hang at the bottom, pull chin over bar. Quality reps — not to failure. Back is already hit hard on Thursday so keep this moderate.',
        videoUrl:
          'https://www.youtube.com/results?search_query=pull+up+proper+form+tutorial+jeff+nippard',
      },
      {
        id: 'chin-ups',
        name: 'Chin-Ups',
        sets: 3,
        reps: '8–10',
        rest: '60 sec',
        muscle: 'Biceps / Lats',
        notes:
          'Underhand grip, shoulder-width. Hits biceps harder than pull-ups — good complement to cover both pulling angles.',
        videoUrl:
          'https://www.youtube.com/results?search_query=chin+up+proper+form+tutorial',
      },
      {
        id: 'push-ups',
        name: 'Push-Ups',
        sets: 3,
        reps: '12–15',
        rest: '60 sec',
        muscle: 'Chest / Triceps',
        notes:
          'Hands slightly wider than shoulder-width. Lower chest to 1 inch from floor, keep core tight throughout.',
        videoUrl:
          'https://www.youtube.com/results?search_query=push+up+proper+form+tutorial+jeff+nippard',
      },
      {
        id: 'pike-push-ups',
        name: 'Pike Push-Ups',
        sets: 3,
        reps: '10',
        rest: '60 sec',
        muscle: 'Shoulders',
        notes:
          'Hips high in an inverted V, hands shoulder-width. Lower head toward floor between your hands. Shoulder press substitute with zero equipment.',
        videoUrl:
          'https://www.youtube.com/results?search_query=pike+push+up+proper+form+tutorial',
      },
      {
        id: 'hollow-body-hold',
        name: 'Hollow Body Hold',
        sets: 3,
        reps: '20–30 sec hold',
        rest: '60 sec',
        muscle: 'Core',
        notes:
          'Lie on back, press lower back into floor, extend arms overhead and raise legs. Same anti-extension pattern as dead bug but held isometrically — a natural step up in difficulty.',
        videoUrl:
          'https://www.youtube.com/results?search_query=hollow+body+hold+proper+form+tutorial',
      },
      {
        id: 'single-leg-calf-raise',
        name: 'Single-Leg Calf Raise',
        sets: 3,
        reps: '15 each foot',
        rest: '60 sec',
        muscle: 'Calves',
        notes:
          'Stand on one foot, rise all the way up, lower slowly (3 sec down). Holds the arch-strengthening benefit from your gym calf work — no equipment needed.',
        videoUrl:
          'https://www.youtube.com/results?search_query=single+leg+calf+raise+arch+support+flat+feet+tutorial',
      },
    ],
  },
];

export const tips: Tip[] = [
  {
    icon: '⏱️',
    title: '30-Min Session Pacing',
    body: "Set a timer between sets — it's the #1 way to stay on schedule. Rest times are 60–90 sec max. Being strict here is what makes 30 min possible without sacrificing volume.",
  },
  {
    icon: '🎯',
    title: 'Progressive Overload',
    body: 'Add weight or reps every 1–2 weeks. Even 2.5 lb per session adds up to 60+ lbs in a year. This is the single biggest driver of muscle growth.',
  },
  {
    icon: '🍽️',
    title: 'Nutrition for Recomp',
    body: 'Eat ~200–300 cal below your TDEE. Target 0.8–1g protein per lb of bodyweight daily to preserve muscle while losing fat.',
  },
  {
    icon: '😴',
    title: 'Sleep',
    body: '7–9 hours is non-negotiable. Growth hormone and testosterone — your two biggest fat-loss and muscle-building tools — peak during deep sleep.',
  },
  {
    icon: '📈',
    title: 'Track Everything',
    body: "Your weight/reps are now saved automatically each session. Check 'Last Session' before each set so you always know what to beat.",
  },
  {
    icon: '🏃',
    title: 'Cardio Strategy',
    body: 'Post-workout elliptical is ideal — glycogen is depleted so your body taps fat stores faster. On lower days (Mon and Wed), swap for an easy treadmill walk instead.',
  },
];

export const schedule: ScheduleRow[] = [
  { day: 'Monday', plan: 'Lower A — Squat · Split Squat · Posterior Chain', color: '#3ACA6E', rest: false },
  { day: 'Tuesday', plan: 'Upper A — Chest · Shoulders · Triceps', color: '#E8533A', rest: false },
  { day: 'Wednesday', plan: 'Lower B — Deadlift · Posterior Chain · Core', color: '#E8A83A', rest: false },
  { day: 'Thursday', plan: 'Upper B — Back · Biceps · Rear Delts', color: '#3A7DE8', rest: false },
  { day: 'Friday', plan: 'Rest Day', color: '#333', rest: true },
  { day: 'Saturday', plan: 'Home — Bodyweight Push · Pull · Core', color: '#A63AE8', rest: false },
  { day: 'Sunday', plan: 'Rest Day', color: '#333', rest: true },
];

export const gymPrehab: PrehabExercise[] = [
  {
    name: 'Banded Side Walks',
    sets: '2 × 15 steps each direction',
    icon: '🦀',
    color: '#3ACA6E',
    notes:
      'Place a light resistance band just above your knees. Stay in a quarter-squat, take slow lateral steps keeping knees pushed out over toes. This fires the glute medius — the #1 muscle that stops your knees from caving inward.',
    videoUrl:
      'https://www.youtube.com/results?search_query=banded+side+walks+glute+medius+activation+tutorial',
  },
  {
    name: 'Bodyweight Squat with Knee Tracking Focus',
    sets: '1 × 10 slow reps',
    icon: '🎯',
    color: '#3ACA6E',
    notes:
      'No weight. Go slow and deliberate — focus on keeping knees pushed out in line with your pinky toe the entire way down and up. Think of it as a movement rehearsal before loading the pattern.',
    videoUrl:
      'https://www.youtube.com/results?search_query=squat+knee+tracking+valgus+correction+tutorial',
  },
];

export const dailyFootRoutine: PrehabExercise[] = [
  {
    name: 'Towel Scrunches',
    sets: '3 × 20 each foot',
    icon: '🧦',
    notes:
      'Place a small towel on a smooth floor. Using only your toes, scrunch it toward you then spread it back out. Builds the intrinsic foot muscles that support the arch from the inside.',
    videoUrl:
      'https://www.youtube.com/results?search_query=towel+scrunches+foot+exercise+flat+feet',
  },
  {
    name: 'Short Foot / Arch Doming',
    sets: '3 × 10 holds (5 sec each) per foot',
    icon: '🦶',
    notes:
      'Without curling your toes, try to shorten your foot by pulling the ball of your foot toward your heel — like creating a dome under your arch. Feels weird at first. This is the single most effective arch-strengthening exercise per physical therapy research.',
    videoUrl:
      'https://www.youtube.com/results?search_query=short+foot+exercise+arch+doming+flat+feet+physical+therapy',
  },
  {
    name: 'Single-Leg Calf Raise',
    sets: '3 × 15 each foot, slow',
    icon: '⬆️',
    notes:
      'Stand on one foot, rise all the way up onto your toes, lower slowly (3 sec down). Full range of motion — all the way up, all the way down. Strengthens the tibialis posterior, which is the primary muscle that holds up your arch. This is the big one.',
    videoUrl:
      'https://www.youtube.com/results?search_query=single+leg+calf+raise+arch+support+flat+feet+tutorial',
  },
  {
    name: 'Toe Spreading',
    sets: '3 × 5 holds (5 sec each) per foot',
    icon: '✋',
    notes:
      "Actively spread all five toes as wide as possible and hold. Most people with flat feet can barely do this at first — the muscles are essentially switched off. Keep at it daily and within a few weeks you'll notice real improvement in foot awareness and control.",
    videoUrl:
      'https://www.youtube.com/results?search_query=toe+spreading+exercise+foot+mobility+flat+feet',
  },
];

export const prehabTimeline: TimelineEntry[] = [
  {
    week: 'Weeks 1–2',
    note: "Foot muscles will feel sore and fatigued — that's normal, they've never been trained.",
  },
  {
    week: 'Weeks 3–4',
    note: 'Toe spreading gets easier. Squat depth and knee tracking start to feel more natural.',
  },
  {
    week: 'Weeks 6–8',
    note: 'Noticeable arch improvement. Knees feel more stable on split squats and stairs.',
  },
  {
    week: 'Month 3+',
    note: 'Start reducing heel plate height on squats. Arches hold up throughout full workouts.',
  },
];
