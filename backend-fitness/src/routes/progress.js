const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Registrar uma nova série
router.post('/:exerciseId', async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { weight, reps, set } = req.body;

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    const progress = await prisma.progress.create({
      data: {
        exerciseId: parseInt(exerciseId),
        weight: parseFloat(weight),
        reps: parseInt(reps),
        set: parseInt(set)
      }
    });

    // Verifica se todas as séries foram completadas
    const allProgress = await prisma.progress.findMany({
      where: { exerciseId: parseInt(exerciseId) }
    });

    const isCompleted = allProgress.length >= exercise.sets;

    res.json({
      progress,
      isCompleted
    });
  } catch (error) {
    console.error('Erro ao registrar progresso:', error);
    res.status(500).json({ error: 'Erro ao registrar progresso' });
  }
});

// Atualizar uma série existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, reps } = req.body;

    const updatedProgress = await prisma.progress.update({
      where: { id: parseInt(id) },
      data: {
        weight: parseFloat(weight),
        reps: parseInt(reps)
      }
    });

    res.json(updatedProgress);
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ error: 'Erro ao atualizar progresso' });
  }
});

// Buscar progresso de um exercício
router.get('/:exerciseId', async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const progress = await prisma.progress.findMany({
      where: { exerciseId: parseInt(exerciseId) },
      orderBy: { set: 'asc' }
    });

    res.json(progress);
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    res.status(500).json({ error: 'Erro ao buscar progresso' });
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

// Buscar último peso usado
router.get('/:exerciseId/last-weight', async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const lastProgress = await prisma.progress.findFirst({
      where: { exerciseId: parseInt(exerciseId) },
      orderBy: { createdAt: 'desc' }
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

module.exports = router; 