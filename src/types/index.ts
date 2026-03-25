export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscle: string;
  notes: string;
  videoUrl: string;
}

export interface Day {
  id: number;
  label: string;
  name: string;
  subtitle: string;
  color: string;
  accent: string;
  cardio: string;
  exercises: Exercise[];
}

export interface Tip {
  icon: string;
  title: string;
  body: string;
}

export interface ScheduleRow {
  day: string;
  plan: string;
  color: string;
  rest: boolean;
}

export interface PrehabExercise {
  name: string;
  sets: string;
  icon: string;
  color?: string;
  notes: string;
  videoUrl: string;
}

export interface TimelineEntry {
  week: string;
  note: string;
}

export interface LogEntry {
  weight: string;
  reps: string;
  date: string;
}

export type WorkoutLog = Record<string, LogEntry>;

export interface Draft {
  weight: string;
  reps: string;
}
