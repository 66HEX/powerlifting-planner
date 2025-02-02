import { ipcRenderer, contextBridge } from 'electron';
import { Plan, Week, Workout, Exercise, Set } from './database/plan-types';

/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sayHello`
   */
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message);
  },
  /**
    Here function for AppBar
   */
  Minimize: () => {
    ipcRenderer.send('minimize');
  },
  Maximize: () => {
    ipcRenderer.send('maximize');
  },
  Close: () => {
    ipcRenderer.send('close');
  },

  db: {
    plans: {
      create: (plan: Omit<Plan, 'id' | 'createdAt' | 'weeks'>) => ipcRenderer.invoke('db:plans:create', plan),
      getById: (id: number) => ipcRenderer.invoke('db:plans:getById', id),
      getAll: () => ipcRenderer.invoke('db:plans:getAll'),
      update: (plan: Plan) => ipcRenderer.invoke('db:plans:update', plan),
      delete: (id: number) => ipcRenderer.invoke('db:plans:delete', id)
    },
    weeks: {
      create: (planId: number, weekNumber: number) => ipcRenderer.invoke('db:weeks:create', { planId, weekNumber }),
      getById: (id: number) => ipcRenderer.invoke('db:weeks:getById', id),
      getByPlanId: (planId: number) => ipcRenderer.invoke('db:weeks:getByPlanId', planId),
      update: (week: Week) => ipcRenderer.invoke('db:weeks:update', week),
      delete: (id: number) => ipcRenderer.invoke('db:weeks:delete', id)
    },
    workouts: {
      create: (weekId: number) => ipcRenderer.invoke('db:workouts:create', weekId),
      getById: (id: number) => ipcRenderer.invoke('db:workouts:getById', id),
      getByWeekId: (weekId: number) => ipcRenderer.invoke('db:workouts:getByWeekId', weekId),
      update: (workout: Workout) => ipcRenderer.invoke('db:workouts:update', workout),
      delete: (id: number) => ipcRenderer.invoke('db:workouts:delete', id)
    },
    exercises: {
      create: (workoutId: number, exercise: Omit<Exercise, 'id' | 'sets'>) =>
        ipcRenderer.invoke('db:exercises:create', { workoutId, exercise }),
      getById: (id: number) => ipcRenderer.invoke('db:exercises:getById', id),
      getByWorkoutId: (workoutId: number) => ipcRenderer.invoke('db:exercises:getByWorkoutId', workoutId),
      update: (exercise: Exercise) => ipcRenderer.invoke('db:exercises:update', exercise),
      delete: (id: number) => ipcRenderer.invoke('db:exercises:delete', id)
    },
    sets: {
      create: (exerciseId: number, set: Omit<Set, 'id'>) => ipcRenderer.invoke('db:sets:create', { exerciseId, set }),
      getById: (id: number) => ipcRenderer.invoke('db:sets:getById', id),
      getByExerciseId: (exerciseId: number) => ipcRenderer.invoke('db:sets:getByExerciseId', exerciseId),
      update: (set: Set) => ipcRenderer.invoke('db:sets:update', set),
      delete: (id: number) => ipcRenderer.invoke('db:sets:delete', id)
    }
  },
  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  }
};

export type { Plan, Week, Workout, Exercise, Set };

contextBridge.exposeInMainWorld('Main', api);
