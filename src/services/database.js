import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('fitness.db');

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Criar tabela de treinos
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          day TEXT NOT NULL
        );`
      );

      // Criar tabela de exercícios
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workoutId INTEGER,
          name TEXT NOT NULL,
          sets INTEGER NOT NULL,
          reps INTEGER NOT NULL,
          targetWeight REAL,
          FOREIGN KEY (workoutId) REFERENCES workouts (id)
        );`
      );

      // Criar tabela de progresso
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          exerciseId INTEGER,
          weight REAL NOT NULL,
          reps INTEGER NOT NULL,
          date TEXT NOT NULL,
          set INTEGER NOT NULL,
          FOREIGN KEY (exerciseId) REFERENCES exercises (id)
        );`
      );
    }, reject, resolve);
  });
};

const getWorkouts = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM workouts`,
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

const addWorkout = (workout) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO workouts (name, day) VALUES (?, ?)`,
        [workout.name, workout.day],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      );
    });
  });
};

const addExercise = (exercise, workoutId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO exercises (workoutId, name, sets, reps, targetWeight) 
         VALUES (?, ?, ?, ?, ?)`,
        [workoutId, exercise.name, exercise.sets, exercise.reps, exercise.targetWeight],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      );
    });
  });
};

const getExercises = (workoutId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM exercises WHERE workoutId = ?`,
        [workoutId],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

const addProgress = (progress) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO progress (exerciseId, weight, reps, date, set) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          progress.exerciseId,
          progress.weight,
          progress.reps,
          new Date().toISOString(),
          progress.set
        ],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      );
    });
  });
};

const getProgress = (exerciseId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM progress WHERE exerciseId = ? ORDER BY date DESC`,
        [exerciseId],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

export {
  initDatabase,
  getWorkouts,
  addWorkout,
  addExercise,
  getExercises,
  addProgress,
  getProgress
}; 