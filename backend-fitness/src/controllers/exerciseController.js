import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Criar um exercício e vinculá-lo a um treino
export const createExercise = async (req, res) => {
  const { name, sets, reps, targetWeight, workoutId } = req.body;

  try {
    console.log('Criando exercício:', { name, sets, reps, targetWeight, workoutId });
    
    const exercise = await prisma.exercise.create({
      data: { 
        name, 
        sets, 
        reps: parseInt(reps) || 0,
        targetWeight: targetWeight ? parseFloat(targetWeight) : null,
        workoutId: parseInt(workoutId)
      },
    });

    console.log('Exercício criado:', exercise);
    res.status(201).json(exercise);
  } catch (error) {
    console.error('Erro ao criar exercício:', error);
    res.status(400).json({ error: "Erro ao criar exercício." });
  }
};

// 📌 Listar todos os exercícios de um treino específico
export const getExercisesByWorkout = async (req, res) => {
  const { workoutId } = req.params;

  try {
    const exercises = await prisma.exercise.findMany({
      where: { workoutId: parseInt(workoutId) },
    });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar exercícios." });
  }
};

// 📌 Atualizar um exercício (sets, nome, etc.)
export const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { name, sets, reps, targetWeight } = req.body;

  try {
    console.log('Atualizando exercício:', { id, name, sets, reps, targetWeight });
    
    const updatedExercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { 
        name, 
        sets, 
        reps: reps ? parseInt(reps) : undefined,
        targetWeight: targetWeight ? parseFloat(targetWeight) : null
      },
    });

    console.log('Exercício atualizado:', updatedExercise);
    res.json(updatedExercise);
  } catch (error) {
    console.error('Erro ao atualizar exercício:', error);
    res.status(400).json({ error: "Erro ao atualizar exercício." });
  }
};

// 📌 Excluir um exercício pelo ID
export const deleteExercise = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.exercise.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Exercício excluído com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir exercício." });
  }
};
