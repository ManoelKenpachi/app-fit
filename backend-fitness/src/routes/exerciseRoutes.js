import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createExercise, getExercisesByWorkout, updateExercise, deleteExercise } from "../controllers/exerciseController.js";

const router = express.Router();

// 📌 Criar um novo exercício dentro de um treino
router.post("/exercises", authenticateToken, createExercise);

// 📌 Listar todos os exercícios de um treino específico
router.get("/exercises/:workoutId", authenticateToken, getExercisesByWorkout);

// 📌 Atualizar um exercício (sets, nome, etc.)
router.put("/exercises/:id", authenticateToken, updateExercise);

// 📌 Excluir um exercício pelo ID
router.delete("/exercises/:id", authenticateToken, deleteExercise);

export default router;
