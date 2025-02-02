export type Set = {
  id: number;
  weight: number;
  reps: number;
  rawInput?: string;
};

export type Exercise = {
  id: number;
  name: string;
  sets: Set[];
  comment?: string;
};

export type Workout = {
  id: number;
  exercises: Exercise[];
};

export type Week = {
  weekNumber: number;
  workouts: Workout[];
};

export type Plan = {
  id: number;
  name: string;
  clientName: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  createdAt: Date;
  weeks: Week[];
};
