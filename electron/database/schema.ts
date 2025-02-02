import sqlite3 from 'sqlite3';
import { join } from 'path';
import { app } from 'electron';

const dbPath = join(app.getPath('userData'), 'training-plans.db');

export const initDB = () => {
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    // Tabele główne
    db.run(`
        CREATE TABLE IF NOT EXISTS plans (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             name TEXT NOT NULL,
                                             client_name TEXT NOT NULL,
                                             duration_weeks INTEGER NOT NULL,
                                             workouts_per_week INTEGER NOT NULL,
                                             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela dla tygodni
    db.run(`
      CREATE TABLE IF NOT EXISTS weeks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL,
        week_number INTEGER NOT NULL,
        FOREIGN KEY(plan_id) REFERENCES plans(id) ON DELETE CASCADE
      )
    `);

    // Tabela dla treningów
    db.run(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        week_id INTEGER NOT NULL,
        FOREIGN KEY(week_id) REFERENCES weeks(id) ON DELETE CASCADE
      )
    `);

    // Tabela dla ćwiczeń
    db.run(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        comment TEXT,
        FOREIGN KEY(workout_id) REFERENCES workouts(id) ON DELETE CASCADE
      )
    `);

    // Tabela dla serii
    db.run(`
      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        raw_input TEXT,
        FOREIGN KEY(exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      )
    `);
  });

  db.close();
};
