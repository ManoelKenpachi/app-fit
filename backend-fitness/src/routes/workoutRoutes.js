import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createWorkout, getWorkouts, getWorkoutOfTheDay, deleteWorkout } from "../controllers/workoutController.js";

const router = express.Router();

// 📌 Criar um treino
router.post("/workouts", authenticateToken, createWorkout);

// 📌 Listar todos os treinos do usuário
router.get("/workouts", authenticateToken, getWorkouts);

// 📌 Obter o treino do dia com base no dia da semana
router.get("/workout-today", authenticateToken, getWorkoutOfTheDay);

// 📌 Excluir um treino pelo ID
router.delete("/workouts/:id", authenticateToken, deleteWorkout);

export default router;
