import {
  getWorkouts,
  addWorkout,
  addExercise,
  getExercises,
  addProgress,
  getProgress
} from './database';

// API local que usa SQLite
const api = {
  // Workouts
  getWorkouts: async () => {
    return await getWorkouts();
  },
  
  createWorkout: async (workout) => {
    const workoutId = await addWorkout(workout);
    
    // Adicionar exercícios
    if (workout.exercises) {
      for (const exercise of workout.exercises) {
        await addExercise(exercise, workoutId);
      }
    }
    
    return { id: workoutId, ...workout };
  },

  // Exercises
  getExercises: async (workoutId) => {
    return await getExercises(workoutId);
  },

  // Progress
  addProgress: async (progress) => {
    return await addProgress(progress);
  },

  getProgress: async (exerciseId) => {
    return await getProgress(exerciseId);
  }
};

export { api }; 