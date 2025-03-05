import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createExercise, getExercisesByWorkout, updateExercise, deleteExercise } from "../controllers/exerciseController.js";

const router = express.Router();

// 📌 Criar um novo exercício dentro de um treino
router.post("/exercises", protect, createExercise);

// 📌 Listar todos os exercícios de um treino específico
router.get("/exercises/:workoutId", protect, getExercisesByWorkout);

// 📌 Atualizar um exercício (sets, nome, etc.)
router.put("/exercises/:id", protect, updateExercise);

// 📌 Excluir um exercício pelo ID
router.delete("/exercises/:id", protect, deleteExercise);

export default router;
