import type { Day, Tip, ScheduleRow, PrehabExercise, TimelineEntry } from '../types';

export const days: Day[] = [
  {
    id: 0,
    label: 'MON',
    name: 'PUSH',
    subtitle: 'Chest \u00b7 Shoulders \u00b7 Triceps',
    color: '#E8533A',
    accent: '#ff7a5c',
    cardio:
      'Elliptical: 5 min moderate pace (level 8\u201310). Alternatively, 5 min incline treadmill walk (3.5 mph / 10\u201312% incline) burns slightly more calories.',
    exercises: [
      {
        name: 'Barbell Bench Press',
        sets: 4,
        reps: '6\u20138',
        rest: '90 sec',
        muscle: 'Chest',
        notes:
          'Control the descent 2 sec down, drive up explosively. 90 sec rest keeps pace for 30 min.',
        videoUrl:
          'https://www.youtube.com/results?search_query=how+to+bench+press+proper+form+jeff+nippard',
      },
      {
        name: 'Dumbbell Shoulder Press',
        sets: 3,
        reps: '10\u201312',
        rest: '75 sec',
        muscle: 'Shoulders',
        notes: "Seated or standing. Keep core braced, don't arch lower back.",
        videoUrl:
          'https://www.youtube.com/results?search_query=dumbbell+shoulder+press+proper+form+tutorial',
      },
      {
        name: 'Cable Lateral Raise',
        sets: 3,
        reps: '12\u201315',
        rest: '60 sec',
        muscle: 'Side Delts',
        notes:
          'Slight bend in elbow. Raise to shoulder height only \u2014 going higher shifts to traps.',
        videoUrl:
          'https://www.youtube.com/results?search_query=cable+lateral+raise+proper+form+jeff+nippard',
      },
      {
        name: 'Tricep Rope Pushdown',
        sets: 3,
        reps: '12\u201315',
        rest: '60 sec',
        muscle: 'Triceps',
        notes: 'Spread the rope at the bottom for full contraction. Keep elbows pinned to sides.',
        videoUrl:
          'https://www.youtube.com/results?search_query=tricep+rope+pushdown+proper+form+tutorial',
      },
    ],
  },
  {
    id: 1,
    label: 'TUE',
    name: 'PULL',
    subtitle: 'Back \u00b7 Biceps \u00b7 Rear Delts',
    color: '#3A7DE8',
    accent: '#5c9fff',
    cardio:
      'Elliptical: 5\u201310 min at moderate-high intensity. Try 30 sec hard / 30 sec easy intervals \u2014 more fat burn in less time than steady state.',
    exercises: [
      {
        name: 'Barbell Row',
        sets: 4,
        reps: '6\u20138',
        rest: '90 sec',
        muscle: 'Mid Back',
        notes: 'Hinge to ~45\u00b0, drive elbows back. Pull to your belly button, not chest.',
        videoUrl: 'https://www.youtube.com/results?search_query=barbell+row+proper+form+tutorial',
      },
      {
        name: 'Lat Pulldown',
        sets: 3,
        reps: '10\u201312',
        rest: '75 sec',
        muscle: 'Lats',
        notes:
          "Lean back slightly, pull bar to upper chest. Don't use momentum \u2014 control the return.",
        videoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+proper+form+tutorial',
      },
      {
        name: 'Face Pulls',
        sets: 3,
        reps: '15\u201320',
        rest: '60 sec',
        muscle: 'Rear Delts',
        notes:
          "Pull to eye level, flare elbows high. Critical for shoulder health \u2014 don't skip this.",
        videoUrl: 'https://www.youtube.com/results?search_query=face+pulls+proper+form+athlean+x',
      },
      {
        name: 'Barbell or Dumbbell Curl',
        sets: 3,
        reps: '10\u201312',
        rest: '60 sec',
        muscle: 'Biceps',
        notes: "Full range \u2014 all the way down. Don't swing at the top.",
        videoUrl: 'https://www.youtube.com/results?search_query=barbell+curl+proper+form+tutorial',
      },
    ],
  },
  {
    id: 2,
    label: 'WED',
    name: 'LEGS',
    subtitle: 'Quads \u00b7 Hamstrings \u00b7 Glutes',
    color: '#3ACA6E',
    accent: '#5df094',
    cardio:
      'Skip elliptical today \u2014 legs are already cooked. Instead: 5\u201310 min easy walk on treadmill (3 mph flat) to flush lactic acid and aid recovery.',
    exercises: [
      {
        name: 'Barbell Back Squat',
        sets: 4,
        reps: '6\u20138',
        rest: '90 sec',
        muscle: 'Quads / Glutes',
        notes: 'Keep chest tall, knees tracking over toes. Break parallel if mobility allows.',
        videoUrl:
          'https://www.youtube.com/results?search_query=barbell+back+squat+proper+form+jeff+nippard',
      },
      {
        name: 'Romanian Deadlift',
        sets: 3,
        reps: '10\u201312',
        rest: '75 sec',
        muscle: 'Hamstrings / Glutes',
        notes: 'Hinge at hips, slight bend in knees. Feel the hamstring stretch at the bottom.',
        videoUrl:
          'https://www.youtube.com/results?search_query=romanian+deadlift+proper+form+tutorial',
      },
      {
        name: 'Leg Press',
        sets: 3,
        reps: '10\u201312',
        rest: '75 sec',
        muscle: 'Quads / Glutes',
        notes: "Higher foot placement = more glutes. Don't fully lock out knees at the top.",
        videoUrl: 'https://www.youtube.com/results?search_query=leg+press+proper+form+tutorial',
      },
      {
        name: 'Seated Leg Curl',
        sets: 3,
        reps: '12\u201315',
        rest: '60 sec',
        muscle: 'Hamstrings',
        notes: 'Slow on the way back up (2\u20133 sec). Hips should stay pinned to the seat.',
        videoUrl:
          'https://www.youtube.com/results?search_query=seated+leg+curl+proper+form+tutorial',
      },
    ],
  },
  {
    id: 3,
    label: 'THU',
    name: 'UPPER',
    subtitle: 'Chest \u00b7 Back \u00b7 Shoulders \u00b7 Arms',
    color: '#A63AE8',
    accent: '#c87aff',
    cardio:
      'Elliptical: 5\u201310 min. Thursday is a good day to push slightly harder on cardio since tomorrow is a rest day \u2014 your body has 48 hrs to recover.',
    exercises: [
      {
        name: 'Incline Dumbbell Press',
        sets: 3,
        reps: '10\u201312',
        rest: '75 sec',
        muscle: 'Upper Chest',
        notes: "Set bench 30\u201345\u00b0. Targets upper chest. Great complement to Monday's flat press.",
        videoUrl:
          'https://www.youtube.com/results?search_query=incline+dumbbell+press+proper+form+tutorial',
      },
      {
        name: 'Seated Cable Row',
        sets: 3,
        reps: '10\u201312',
        rest: '75 sec',
        muscle: 'Mid Back / Lats',
        notes: "Keep chest tall, pull handle to lower sternum. Don't round forward at the stretch.",
        videoUrl:
          'https://www.youtube.com/results?search_query=seated+cable+row+proper+form+tutorial',
      },
      {
        name: 'Pull-Ups or Assisted Pull-Ups',
        sets: 3,
        reps: '6\u201310',
        rest: '75 sec',
        muscle: 'Lats / Biceps',
        notes:
          'Dead hang at bottom, pull until chin clears bar. Use the assisted machine if needed.',
        videoUrl:
          'https://www.youtube.com/results?search_query=pull+up+proper+form+tutorial+jeff+nippard',
      },
      {
        name: 'Superset: DB Curl + Skull Crusher',
        sets: 3,
        reps: '10\u201312 each',
        rest: '75 sec',
        muscle: 'Biceps + Triceps',
        notes:
          'Do these back-to-back with no rest between. Curl first, then skull crusher. Saves ~5 min.',
        videoUrl:
          'https://www.youtube.com/results?search_query=skull+crushers+lying+tricep+extension+proper+form',
      },
    ],
  },
  {
    id: 4,
    label: 'SAT',
    name: 'LOWER+CORE',
    subtitle: 'Deadlift \u00b7 Posterior Chain \u00b7 Core',
    color: '#E8A83A',
    accent: '#ffc95c',
    cardio:
      "Elliptical: 5\u201310 min easy-moderate. Sunday is a full rest day after this, so treat this cardio as active recovery \u2014 don't go all out.",
    exercises: [
      {
        name: 'Conventional Deadlift',
        sets: 4,
        reps: '5\u20136',
        rest: '90 sec',
        muscle: 'Full Posterior Chain',
        notes:
          'Hip hinge \u2014 drive the floor away. Keep bar dragging your shins. Heaviest lift of the week.',
        videoUrl:
          'https://www.youtube.com/results?search_query=conventional+deadlift+proper+form+jeff+nippard',
      },
      {
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
        name: 'Ab Wheel Rollout',
        sets: 3,
        reps: '8\u201312',
        rest: '60 sec',
        muscle: 'Core',
        notes: "Brace core like you're about to get punched. Don't let hips sag.",
        videoUrl:
          'https://www.youtube.com/results?search_query=ab+wheel+rollout+proper+form+tutorial',
      },
      {
        name: 'Cable Woodchop (High to Low)',
        sets: 3,
        reps: '12 each side',
        rest: '60 sec',
        muscle: 'Obliques / Core',
        notes:
          'Rotational movement targeting obliques \u2014 the muscles that cinch your waistline. Keep hips square.',
        videoUrl:
          'https://www.youtube.com/results?search_query=cable+woodchop+high+to+low+proper+form+tutorial',
      },
    ],
  },
];

export const tips: Tip[] = [
  {
    icon: '\u23f1\ufe0f',
    title: '30-Min Session Pacing',
    body: "Set a timer between sets \u2014 it's the #1 way to stay on schedule. Rest times are 60\u201390 sec max. Being strict here is what makes 30 min possible without sacrificing volume.",
  },
  {
    icon: '\ud83c\udfaf',
    title: 'Progressive Overload',
    body: 'Add weight or reps every 1\u20132 weeks. Even 2.5 lb per session adds up to 60+ lbs in a year. This is the single biggest driver of muscle growth.',
  },
  {
    icon: '\ud83c\udf7d\ufe0f',
    title: 'Nutrition for Recomp',
    body: 'Eat ~200\u2013300 cal below your TDEE. Target 0.8\u20131g protein per lb of bodyweight daily to preserve muscle while losing fat.',
  },
  {
    icon: '\ud83d\ude34',
    title: 'Sleep',
    body: '7\u20139 hours is non-negotiable. Growth hormone and testosterone \u2014 your two biggest fat-loss and muscle-building tools \u2014 peak during deep sleep.',
  },
  {
    icon: '\ud83d\udcc8',
    title: 'Track Everything',
    body: "Your weight/reps are now saved automatically each session. Check 'Last Session' before each set so you always know what to beat.",
  },
  {
    icon: '\ud83c\udfc3',
    title: 'Cardio Strategy',
    body: 'Post-workout elliptical is ideal \u2014 glycogen is depleted so your body taps fat stores faster. On leg day (Wed), swap for an easy treadmill walk instead.',
  },
];

export const schedule: ScheduleRow[] = [
  { day: 'Monday', plan: 'Push \u2014 Chest \u00b7 Shoulders \u00b7 Triceps', color: '#E8533A', rest: false },
  { day: 'Tuesday', plan: 'Pull \u2014 Back \u00b7 Biceps \u00b7 Rear Delts', color: '#3A7DE8', rest: false },
  { day: 'Wednesday', plan: 'Legs \u2014 Quads \u00b7 Hamstrings \u00b7 Glutes', color: '#3ACA6E', rest: false },
  { day: 'Thursday', plan: 'Upper \u2014 Full Upper Body + Arms', color: '#A63AE8', rest: false },
  { day: 'Friday', plan: 'Rest Day', color: '#333', rest: true },
  { day: 'Saturday', plan: 'Lower + Core \u2014 Deadlift Focus', color: '#E8A83A', rest: false },
  { day: 'Sunday', plan: 'Rest Day', color: '#333', rest: true },
];

export const gymPrehab: PrehabExercise[] = [
  {
    name: 'Banded Side Walks',
    sets: '2 \u00d7 15 steps each direction',
    icon: '\ud83e\udd80',
    color: '#3ACA6E',
    notes:
      'Place a light resistance band just above your knees. Stay in a quarter-squat, take slow lateral steps keeping knees pushed out over toes. This fires the glute medius \u2014 the #1 muscle that stops your knees from caving inward.',
    videoUrl:
      'https://www.youtube.com/results?search_query=banded+side+walks+glute+medius+activation+tutorial',
  },
  {
    name: 'Bodyweight Squat with Knee Tracking Focus',
    sets: '1 \u00d7 10 slow reps',
    icon: '\ud83c\udfaf',
    color: '#3ACA6E',
    notes:
      'No weight. Go slow and deliberate \u2014 focus on keeping knees pushed out in line with your pinky toe the entire way down and up. Think of it as a movement rehearsal before loading the pattern.',
    videoUrl:
      'https://www.youtube.com/results?search_query=squat+knee+tracking+valgus+correction+tutorial',
  },
];

export const dailyFootRoutine: PrehabExercise[] = [
  {
    name: 'Towel Scrunches',
    sets: '3 \u00d7 20 each foot',
    icon: '\ud83e\udde6',
    notes:
      'Place a small towel on a smooth floor. Using only your toes, scrunch it toward you then spread it back out. Builds the intrinsic foot muscles that support the arch from the inside.',
    videoUrl:
      'https://www.youtube.com/results?search_query=towel+scrunches+foot+exercise+flat+feet',
  },
  {
    name: 'Short Foot / Arch Doming',
    sets: '3 \u00d7 10 holds (5 sec each) per foot',
    icon: '\ud83e\uddb6',
    notes:
      'Without curling your toes, try to shorten your foot by pulling the ball of your foot toward your heel \u2014 like creating a dome under your arch. Feels weird at first. This is the single most effective arch-strengthening exercise per physical therapy research.',
    videoUrl:
      'https://www.youtube.com/results?search_query=short+foot+exercise+arch+doming+flat+feet+physical+therapy',
  },
  {
    name: 'Single-Leg Calf Raise',
    sets: '3 \u00d7 15 each foot, slow',
    icon: '\u2b06\ufe0f',
    notes:
      'Stand on one foot, rise all the way up onto your toes, lower slowly (3 sec down). Full range of motion \u2014 all the way up, all the way down. Strengthens the tibialis posterior, which is the primary muscle that holds up your arch. This is the big one.',
    videoUrl:
      'https://www.youtube.com/results?search_query=single+leg+calf+raise+arch+support+flat+feet+tutorial',
  },
  {
    name: 'Toe Spreading',
    sets: '3 \u00d7 5 holds (5 sec each) per foot',
    icon: '\u270b',
    notes:
      "Actively spread all five toes as wide as possible and hold. Most people with flat feet can barely do this at first \u2014 the muscles are essentially switched off. Keep at it daily and within a few weeks you'll notice real improvement in foot awareness and control.",
    videoUrl:
      'https://www.youtube.com/results?search_query=toe+spreading+exercise+foot+mobility+flat+feet',
  },
];

export const prehabTimeline: TimelineEntry[] = [
  {
    week: 'Weeks 1\u20132',
    note: "Foot muscles will feel sore and fatigued \u2014 that's normal, they've never been trained.",
  },
  {
    week: 'Weeks 3\u20134',
    note: 'Toe spreading gets easier. Squat depth and knee tracking start to feel more natural.',
  },
  {
    week: 'Weeks 6\u20138',
    note: 'Noticeable arch improvement. Knees feel more stable on split squats and stairs.',
  },
  {
    week: 'Month 3+',
    note: 'Start reducing heel plate height on squats. Arches hold up throughout full workouts.',
  },
];
