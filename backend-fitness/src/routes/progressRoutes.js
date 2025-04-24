import express from "express";
import { PrismaClient } from '@prisma/client';
import { protect } from "../middlewares/authMiddleware.js";
import { registerProgress, getExerciseProgress, getUserProgress, updateProgress } from "../controllers/progressController.js";

const router = express.Router();
const prisma = new PrismaClient();

// Proteger todas as rotas
router.use(protect);

// Registrar progresso de um exercício
router.post('/:exerciseId', registerProgress);

// Buscar progresso de um exercício
router.get('/:exerciseId/list', getExerciseProgress);

// Buscar histórico de progresso do usuário
router.get('/history', getUserProgress);

// Atualizar uma série
router.put('/:progressId', updateProgress);

// Buscar último peso usado
router.get('/:exerciseId/last-weight', async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const lastProgress = await prisma.progress.findFirst({
      where: { exerciseId: parseInt(exerciseId) },
      orderBy: { date: 'desc' }
    });

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) }
    });

    res.json({
      weight: lastProgress?.weight || exercise?.targetWeight || 0
    });
  } catch (error) {
    console.error('Erro ao buscar último peso:', error);
    res.status(500).json({ error: 'Erro ao buscar último peso' });
  }
});

// Atualizar peso alvo do exercício
router.post('/:exerciseId/update-weight', async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { weight } = req.body;

    const updatedExercise = await prisma.exercise.update({
      where: { id: parseInt(exerciseId) },
      data: { targetWeight: parseFloat(weight) }
    });

    res.json(updatedExercise);
  } catch (error) {
    console.error('Erro ao atualizar peso alvo:', error);
    res.status(500).json({ error: 'Erro ao atualizar peso alvo' });
  }
});

export default router;
