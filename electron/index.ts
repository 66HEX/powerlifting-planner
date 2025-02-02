// Native
import { join } from 'path';
import { Plan, Week, Workout, Exercise, Set, database } from './database';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, nativeTheme, screen, IpcMainInvokeEvent } from 'electron';
import isDev from 'electron-is-dev';

function createWindow() {
  // Get the primary display's dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { height } = primaryDisplay.workAreaSize;
  const { width } = primaryDisplay.workAreaSize;
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    frame: true,
    show: true,
    resizable: true,
    fullscreenable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../dist-vite/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  window.webContents.openDevTools();

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });

  nativeTheme.themeSource = 'dark';
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  database.initDB();
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'common.hiElectron'), 500);
});

// Handlery dla planów treningowych
ipcMain.handle(
  'db:plans:create',
  async (_event: IpcMainInvokeEvent, plan: Omit<Plan, 'id' | 'createdAt' | 'weeks'>) => {
    return await database.plans.create(plan);
  }
);

ipcMain.handle('db:plans:getAll', async (_event: IpcMainInvokeEvent) => {
  return await database.plans.getAll();
});

ipcMain.handle('db:plans:getById', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.plans.getById(id);
});

ipcMain.handle('db:plans:update', async (_event: IpcMainInvokeEvent, plan: Plan) => {
  return await database.plans.update(plan);
});

ipcMain.handle('db:plans:delete', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.plans.delete(id);
});

// Handlery dla tygodni
ipcMain.handle(
  'db:weeks:create',
  async (_event: IpcMainInvokeEvent, { planId, weekNumber }: { planId: number; weekNumber: number }) => {
    return await database.weeks.create(planId, weekNumber);
  }
);

ipcMain.handle('db:weeks:getById', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.weeks.getById(id);
});

ipcMain.handle('db:weeks:getByPlanId', async (_event: IpcMainInvokeEvent, planId: number) => {
  return await database.weeks.getByPlanId(planId);
});

ipcMain.handle('db:weeks:update', async (_event: IpcMainInvokeEvent, week: Week) => {
  return await database.weeks.update(week);
});

ipcMain.handle('db:weeks:delete', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.weeks.delete(id);
});

// Handlery dla treningów
ipcMain.handle('db:workouts:create', async (_event: IpcMainInvokeEvent, weekId: number) => {
  return await database.workouts.create(weekId);
});

ipcMain.handle('db:workouts:getById', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.workouts.getById(id);
});

ipcMain.handle('db:workouts:getByWeekId', async (_event: IpcMainInvokeEvent, weekId: number) => {
  return await database.workouts.getByWeekId(weekId);
});

ipcMain.handle('db:workouts:update', async (_event: IpcMainInvokeEvent, workout: Workout) => {
  return await database.workouts.update(workout);
});

ipcMain.handle('db:workouts:delete', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.workouts.delete(id);
});

// Handlery dla ćwiczeń
ipcMain.handle(
  'db:exercises:create',
  async (
    _event: IpcMainInvokeEvent,
    { workoutId, exercise }: { workoutId: number; exercise: Omit<Exercise, 'id' | 'sets'> }
  ) => {
    return await database.exercises.create(workoutId, exercise);
  }
);

ipcMain.handle('db:exercises:getById', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.exercises.getById(id);
});

ipcMain.handle('db:exercises:getByWorkoutId', async (_event: IpcMainInvokeEvent, workoutId: number) => {
  return await database.exercises.getByWorkoutId(workoutId);
});

ipcMain.handle('db:exercises:update', async (_event: IpcMainInvokeEvent, exercise: Exercise) => {
  return await database.exercises.update(exercise);
});

ipcMain.handle('db:exercises:delete', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.exercises.delete(id);
});

// Handlery dla serii
ipcMain.handle(
  'db:sets:create',
  async (_event: IpcMainInvokeEvent, { exerciseId, set }: { exerciseId: number; set: Omit<Set, 'id'> }) => {
    return await database.sets.create(exerciseId, set);
  }
);

ipcMain.handle('db:sets:getById', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.sets.getById(id);
});

ipcMain.handle('db:sets:getByExerciseId', async (_event: IpcMainInvokeEvent, exerciseId: number) => {
  return await database.sets.getByExerciseId(exerciseId);
});

ipcMain.handle('db:sets:update', async (_event: IpcMainInvokeEvent, set: Set) => {
  return await database.sets.update(set);
});

ipcMain.handle('db:sets:delete', async (_event: IpcMainInvokeEvent, id: number) => {
  return await database.sets.delete(id);
});
