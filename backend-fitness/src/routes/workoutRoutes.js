import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createWorkout, getWorkouts, getWorkoutOfTheDay, deleteWorkout, updateWorkout, getWorkoutHistory, addExerciseToWorkout } from "../controllers/workoutController.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Aplicar middleware de autenticação em todas as rotas
router.use(protect);

// Rotas
router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/workout-today", getWorkoutOfTheDay);
router.get("/history", getWorkoutHistory);

// Adicionar exercício a um treino existente
router.post("/:workoutId/exercises", addExerciseToWorkout);

// Obter um treino específico
router.get("/:id", async (req, res) => {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { exercises: true }
    });

    if (!workout) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }

    if (workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    res.json(workout);
  } catch (error) {
    console.error("Erro ao buscar treino:", error);
    res.status(500).json({ error: "Erro ao buscar treino" });
  }
});

// Excluir um treino
router.delete("/:id", deleteWorkout);

// Atualizar um treino
router.put("/:id", updateWorkout);

export default router;
