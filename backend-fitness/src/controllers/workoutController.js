import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createWorkout = async (req, res) => {
  const { name, day, exercises } = req.body;
  const userId = req.user.id;

  try {
    console.log('=== INÍCIO DA CRIAÇÃO DE TREINO ===');
    console.log('Dados recebidos:', { name, day, exercises, userId });

    // Validações básicas
    if (!name || !day || !exercises || !Array.isArray(exercises)) {
      console.log('Dados inválidos:', { name, day, exercises });
      return res.status(400).json({ 
        error: "Dados inválidos. Nome, dia e exercícios são obrigatórios." 
      });
    }

    // Validar cada exercício
    for (const exercise of exercises) {
      if (!exercise.name || !exercise.sets || !exercise.reps) {
        console.log('Exercício inválido:', exercise);
        return res.status(400).json({ 
          error: "Dados inválidos. Cada exercício deve ter nome, séries e repetições." 
        });
      }
    }

    // Criar novo treino
    console.log('Criando novo treino');
    const workoutData = {
      name,
      day,
      userId,
      exercises: {
        create: exercises.map(exercise => ({
          name: exercise.name,
          sets: parseInt(exercise.sets),
          reps: parseInt(exercise.reps),
          targetWeight: exercise.targetWeight ? parseFloat(exercise.targetWeight) : null,
          weight: 0
        }))
      }
    };

    console.log('Dados preparados para criação:', workoutData);

    const workout = await prisma.workout.create({
      data: workoutData,
      include: {
        exercises: true
      }
    });

    console.log('Treino criado com sucesso:', workout);
    console.log('=== FIM DA CRIAÇÃO DE TREINO ===');
    res.json(workout);
  } catch (error) {
    console.error("Erro detalhado ao criar treino:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Erro ao criar treino.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await prisma.workout.findMany({
      where: {
        userId: userId
      },
      include: {
        exercises: true
      }
    });
    res.json(workouts);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ error: 'Erro ao buscar treinos' });
  }
};

export const getWorkoutHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await prisma.workout.findMany({
      where: {
        userId: userId,
      },
      include: {
        exercises: {
          include: {
            progress: {
              orderBy: {
                date: 'desc'
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Formatar os dados para facilitar a visualização do progresso
    const formattedWorkouts = workouts.map(workout => ({
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        progressHistory: exercise.progress.reduce((acc, curr) => {
          const date = curr.date.toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            weight: curr.weight,
            reps: curr.reps,
            set: curr.set
          });
          return acc;
        }, {})
      }))
    }));

    res.json(formattedWorkouts);
  } catch (error) {
    console.error('Erro ao buscar histórico de treinos:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de treinos' });
  }
};

export const getWorkoutOfTheDay = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDay = weekdays[today.getDay()];

    console.log('ID do usuário autenticado:', userId);
    console.log('Dia atual:', currentDay);

    const workout = await prisma.workout.findFirst({
      where: {
        userId: userId,
        day: currentDay
      },
      include: {
        exercises: true
      }
    });

    console.log('Treino encontrado:', workout);
    res.json(workout);
  } catch (error) {
    console.error('Erro ao buscar treinos do dia:', error);
    res.status(500).json({ error: 'Erro ao buscar treinos do dia' });
  }
};

export const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  console.log('Recebida requisição para excluir treino:', { id, userId });

  try {
    // Verificar se o treino pertence ao usuário
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(id) },
      include: { exercises: true }
    });

    console.log('Treino encontrado:', workout);

    if (!workout) {
      console.log('Treino não encontrado');
      return res.status(404).json({ error: "Treino não encontrado." });
    }

    if (workout.userId !== userId) {
      console.log('Usuário não autorizado:', { treinoUserId: workout.userId, requestUserId: userId });
      return res.status(403).json({ error: "Não autorizado a excluir este treino." });
    }

    // Usa uma transação para garantir que tudo seja excluído ou nada seja excluído
    const result = await prisma.$transaction(async (prisma) => {
      // Primeiro exclui todos os exercícios
      await prisma.exercise.deleteMany({
        where: { workoutId: parseInt(id) }
      });

      // Depois exclui o treino
      const deletedWorkout = await prisma.workout.delete({
        where: { id: parseInt(id) }
      });

      return deletedWorkout;
    });

    console.log('Treino e exercícios excluídos com sucesso:', result);

    res.json({ 
      message: "Treino excluído com sucesso!",
      deletedWorkout: result
    });
  } catch (error) {
    console.error("Erro ao excluir treino:", error);
    res.status(500).json({ 
      error: "Erro ao excluir treino.",
      details: error.message 
    });
  }
};

export const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { name, day, exercises } = req.body;
  const userId = req.user.id;

  try {
    console.log('Atualizando treino:', { id, name, day, exercises });

    // Verifica se o treino existe e pertence ao usuário
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: parseInt(id) },
      include: { exercises: true }
    });

    if (!existingWorkout || existingWorkout.userId !== userId) {
      return res.status(403).json({ error: "Não autorizado a atualizar este treino." });
    }

    // Atualiza apenas os dados básicos do treino
    const updatedWorkout = await prisma.workout.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existingWorkout.name,
        day: day || existingWorkout.day,
      },
      include: {
        exercises: true
      }
    });

    console.log('Treino atualizado com sucesso:', updatedWorkout);
    res.json(updatedWorkout);
  } catch (error) {
    console.error("Erro ao atualizar treino:", error);
    res.status(400).json({ 
      error: "Erro ao atualizar treino.",
      details: error.message 
    });
  }
};

// Adicionar novo exercício a um treino existente
export const addExerciseToWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const { name, sets, reps, targetWeight } = req.body;
  const userId = req.user.id;

  try {
    // Verificar se o treino existe e pertence ao usuário
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
      include: { exercises: true }
    });

    if (!workout) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }

    if (workout.userId !== userId) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    // Adicionar novo exercício
    const exercise = await prisma.exercise.create({
      data: {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        targetWeight: targetWeight ? parseFloat(targetWeight) : null,
        weight: 0,
        workoutId: parseInt(workoutId)
      }
    });

    res.json(exercise);
  } catch (error) {
    console.error("Erro ao adicionar exercício:", error);
    res.status(500).json({ 
      error: "Erro ao adicionar exercício",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
