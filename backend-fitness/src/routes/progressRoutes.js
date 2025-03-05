import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { logProgress, getProgressByExercise, getUserProgress } from "../controllers/progressController.js";

const router = express.Router();

// 📌 Registrar o progresso de um exercício
router.post("/progress", protect, logProgress);

// 📌 Listar o progresso de um exercício específico
router.get("/progress/:exerciseId", protect, getProgressByExercise);

// 📌 Listar histórico de progresso do usuário
router.get("/progress-history", protect, getUserProgress);

export default router;
