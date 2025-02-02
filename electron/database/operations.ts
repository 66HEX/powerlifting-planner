import sqlite3 from 'sqlite3';
import { join } from 'path';
import { app } from 'electron';
import { Plan, Week, Workout, Exercise, Set } from './plan-types';

const dbPath = join(app.getPath('userData'), 'training-plans.db');

// Helper functions dla transakcji
const withTransaction = async <T>(callback: (db: sqlite3.Database) => Promise<T>): Promise<T> => {
  const db = new sqlite3.Database(dbPath);

  try {
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    const result = await callback(db);

    await new Promise((resolve, reject) => {
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });

    return result;
  } catch (error) {
    await new Promise((resolve) => {
      db.run('ROLLBACK', () => resolve(undefined));
    });
    throw error;
  } finally {
    db.close();
  }
};

// Helper functions dla zapytań
const dbGet = <T>(db: sqlite3.Database, query: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};

const dbRun = (db: sqlite3.Database, query: string, params: any[] = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Operacje dla planów
const PlanOperations = {
  async createPlan(plan: Omit<Plan, 'id' | 'createdAt' | 'weeks'>): Promise<number> {
    return withTransaction(async (db) => {
      const result = await dbRun(
        db,
        `INSERT INTO plans (name, client_name, duration_weeks, workouts_per_week)
         VALUES (?, ?, ?, ?)`,
        [plan.name, plan.clientName, plan.durationWeeks, plan.workoutsPerWeek]
      );
      return result.lastID!;
    });
  },

  async getPlanById(id: number): Promise<Plan | undefined> {
    const db = new sqlite3.Database(dbPath);
    try {
      const plans = await dbGet<Plan>(db, `SELECT * FROM plans WHERE id = ?`, [id]);
      if (plans.length === 0) return undefined;

      const plan = plans[0];
      const weeks = await WeekOperations.getWeeksByPlanId(plan.id);
      return { ...plan, weeks };
    } finally {
      db.close();
    }
  },

  async getAllPlans(): Promise<Plan[]> {
    const db = new sqlite3.Database(dbPath);
    try {
      const plans = await dbGet<Plan>(db, `SELECT * FROM plans ORDER BY created_at DESC`);
      return Promise.all(
        plans.map(async (plan) => ({
          ...plan,
          weeks: await WeekOperations.getWeeksByPlanId(plan.id)
        }))
      );
    } finally {
      db.close();
    }
  },

  async updatePlan(plan: Plan): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(
        db,
        `UPDATE plans SET
          name = ?,
          client_name = ?,
          duration_weeks = ?,
          workouts_per_week = ?
         WHERE id = ?`,
        [plan.name, plan.clientName, plan.durationWeeks, plan.workoutsPerWeek, plan.id]
      );
    });
  },

  async deletePlan(id: number): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(db, `DELETE FROM plans WHERE id = ?`, [id]);
    });
  }
};

// Operacje dla tygodni
const WeekOperations = {
  async createWeek(planId: number, weekNumber: number): Promise<number> {
    return withTransaction(async (db) => {
      const result = await dbRun(db, `INSERT INTO weeks (plan_id, week_number) VALUES (?, ?)`, [planId, weekNumber]);
      return result.lastID!;
    });
  },

  async getWeekById(id: number): Promise<Week | undefined> {
    const db = new sqlite3.Database(dbPath);
    try {
      const weeks = await dbGet<Week>(db, `SELECT * FROM weeks WHERE id = ?`, [id]);
      if (weeks.length === 0) return undefined;

      const week = weeks[0];
      const workouts = await WorkoutOperations.getWorkoutsByWeekId(week.id);
      return { ...week, workouts };
    } finally {
      db.close();
    }
  },

  async getWeeksByPlanId(planId: number): Promise<Week[]> {
    const db = new sqlite3.Database(dbPath);
    try {
      const weeks = await dbGet<Week>(db, `SELECT * FROM weeks WHERE plan_id = ? ORDER BY week_number ASC`, [planId]);
      return Promise.all(
        weeks.map(async (week) => ({
          ...week,
          workouts: await WorkoutOperations.getWorkoutsByWeekId(week.id)
        }))
      );
    } finally {
      db.close();
    }
  },

  async updateWeek(week: Week): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(
        db,
        `UPDATE weeks SET
          week_number = ?
         WHERE id = ?`,
        [week.weekNumber, week.id]
      );
    });
  },

  async deleteWeek(id: number): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(db, `DELETE FROM weeks WHERE id = ?`, [id]);
    });
  }
};

// Operacje dla treningów
const WorkoutOperations = {
  async createWorkout(weekId: number): Promise<number> {
    return withTransaction(async (db) => {
      const result = await dbRun(db, `INSERT INTO workouts (week_id) VALUES (?)`, [weekId]);
      return result.lastID!;
    });
  },

  async getWorkoutById(id: number): Promise<Workout | undefined> {
    const db = new sqlite3.Database(dbPath);
    try {
      const workouts = await dbGet<Workout>(db, `SELECT * FROM workouts WHERE id = ?`, [id]);
      if (workouts.length === 0) return undefined;

      const workout = workouts[0];
      const exercises = await ExerciseOperations.getExercisesByWorkoutId(workout.id);
      return { ...workout, exercises };
    } finally {
      db.close();
    }
  },

  async getWorkoutsByWeekId(weekId: number): Promise<Workout[]> {
    const db = new sqlite3.Database(dbPath);
    try {
      const workouts = await dbGet<Workout>(db, `SELECT * FROM workouts WHERE week_id = ? ORDER BY id ASC`, [weekId]);
      return Promise.all(
        workouts.map(async (workout) => ({
          ...workout,
          exercises: await ExerciseOperations.getExercisesByWorkoutId(workout.id)
        }))
      );
    } finally {
      db.close();
    }
  },

  async updateWorkout(workout: Workout): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(
        db,
        `UPDATE workouts SET
          week_id = ?
         WHERE id = ?`,
        [workout.weekId, workout.id]
      );
    });
  },

  async deleteWorkout(id: number): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(db, `DELETE FROM workouts WHERE id = ?`, [id]);
    });
  }
};

// Operacje dla ćwiczeń
const ExerciseOperations = {
  async createExercise(workoutId: number, exercise: Omit<Exercise, 'id' | 'sets'>): Promise<number> {
    return withTransaction(async (db) => {
      const result = await dbRun(
        db,
        `INSERT INTO exercises (workout_id, name, comment)
         VALUES (?, ?, ?)`,
        [workoutId, exercise.name, exercise.comment]
      );
      return result.lastID!;
    });
  },

  async getExerciseById(id: number): Promise<Exercise | undefined> {
    const db = new sqlite3.Database(dbPath);
    try {
      const exercises = await dbGet<Exercise>(db, `SELECT * FROM exercises WHERE id = ?`, [id]);
      if (exercises.length === 0) return undefined;

      const exercise = exercises[0];
      const sets = await SetOperations.getSetsByExerciseId(exercise.id);
      return { ...exercise, sets };
    } finally {
      db.close();
    }
  },

  async getExercisesByWorkoutId(workoutId: number): Promise<Exercise[]> {
    const db = new sqlite3.Database(dbPath);
    try {
      const exercises = await dbGet<Exercise>(db, `SELECT * FROM exercises WHERE workout_id = ? ORDER BY id ASC`, [
        workoutId
      ]);
      return Promise.all(
        exercises.map(async (exercise) => ({
          ...exercise,
          sets: await SetOperations.getSetsByExerciseId(exercise.id)
        }))
      );
    } finally {
      db.close();
    }
  },

  async updateExercise(exercise: Exercise): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(
        db,
        `UPDATE exercises SET
          name = ?,
          comment = ?
         WHERE id = ?`,
        [exercise.name, exercise.comment, exercise.id]
      );
    });
  },

  async deleteExercise(id: number): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(db, `DELETE FROM exercises WHERE id = ?`, [id]);
    });
  }
};

// Operacje dla serii
const SetOperations = {
  async createSet(exerciseId: number, set: Omit<Set, 'id'>): Promise<number> {
    return withTransaction(async (db) => {
      const result = await dbRun(
        db,
        `INSERT INTO sets (exercise_id, weight, reps, raw_input)
         VALUES (?, ?, ?, ?)`,
        [exerciseId, set.weight, set.reps, set.rawInput]
      );
      return result.lastID!;
    });
  },

  async getSetById(id: number): Promise<Set | undefined> {
    const db = new sqlite3.Database(dbPath);
    try {
      const sets = await dbGet<Set>(db, `SELECT * FROM sets WHERE id = ?`, [id]);
      return sets[0];
    } finally {
      db.close();
    }
  },

  async getSetsByExerciseId(exerciseId: number): Promise<Set[]> {
    const db = new sqlite3.Database(dbPath);
    try {
      return dbGet<Set>(db, `SELECT * FROM sets WHERE exercise_id = ? ORDER BY id ASC`, [exerciseId]);
    } finally {
      db.close();
    }
  },

  async updateSet(set: Set): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(
        db,
        `UPDATE sets SET
          weight = ?,
          reps = ?,
          raw_input = ?
         WHERE id = ?`,
        [set.weight, set.reps, set.rawInput, set.id]
      );
    });
  },

  async deleteSet(id: number): Promise<void> {
    return withTransaction(async (db) => {
      await dbRun(db, `DELETE FROM sets WHERE id = ?`, [id]);
    });
  }
};

// Eksport wszystkich operacji
export const database = {
  plans: PlanOperations,
  weeks: WeekOperations,
  workouts: WorkoutOperations,
  exercises: ExerciseOperations,
  sets: SetOperations
};
