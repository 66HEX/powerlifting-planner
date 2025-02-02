import { initDB } from './schema';
import { database as operations } from './operations';

// Eksportujemy wszystkie operacje bazy danych
export const database = {
  // Inicjalizacja bazy danych
  initDB,

  // Operacje na planach treningowych
  plans: {
    create: operations.plans.createPlan,
    getById: operations.plans.getPlanById,
    getAll: operations.plans.getAllPlans,
    update: operations.plans.updatePlan,
    delete: operations.plans.deletePlan
  },

  // Operacje na tygodniach
  weeks: {
    create: operations.weeks.createWeek,
    getById: operations.weeks.getWeekById,
    getByPlanId: operations.weeks.getWeeksByPlanId,
    update: operations.weeks.updateWeek,
    delete: operations.weeks.deleteWeek
  },

  // Operacje na treningach
  workouts: {
    create: operations.workouts.createWorkout,
    getById: operations.workouts.getWorkoutById,
    getByWeekId: operations.workouts.getWorkoutsByWeekId,
    update: operations.workouts.updateWorkout,
    delete: operations.workouts.deleteWorkout
  },

  // Operacje na ćwiczeniach
  exercises: {
    create: operations.exercises.createExercise,
    getById: operations.exercises.getExerciseById,
    getByWorkoutId: operations.exercises.getExercisesByWorkoutId,
    update: operations.exercises.updateExercise,
    delete: operations.exercises.deleteExercise
  },

  // Operacje na seriach
  sets: {
    create: operations.sets.createSet,
    getById: operations.sets.getSetById,
    getByExerciseId: operations.sets.getSetsByExerciseId,
    update: operations.sets.updateSet,
    delete: operations.sets.deleteSet
  }
};

// Typy eksportowane dla łatwiejszego użycia w innych częściach aplikacji
export type { Plan, Week, Workout, Exercise, Set } from './plan-types';
