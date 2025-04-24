import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função auxiliar para logging
const logProgress = (action, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${action}:`, JSON.stringify(data, null, 2));
};

// Função para formatar data no formato brasileiro
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Classe personalizada para erros de negócio
class BusinessError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

// Função para tratamento uniforme de erros
const handleError = (error, res) => {
  logProgress('Erro', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });

  if (error instanceof BusinessError) {
    return res.status(error.code).json({ 
      error: error.message 
    });
  }

  // Erros do Prisma
  if (error.code === 'P2002') {
    return res.status(409).json({ 
      error: 'Registro duplicado encontrado' 
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ 
      error: 'Registro não encontrado' 
    });
  }

  // Erro genérico
  return res.status(500).json({ 
    error: 'Erro interno do servidor' 
  });
};

// 📌 Registrar progresso de um exercício
export const registerProgress = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { weight, reps } = req.body;
    const userId = req.user.id;

    logProgress('Iniciando registro de progresso', { exerciseId, weight, reps, userId });

    // Validações básicas
    if (!exerciseId) {
      throw new BusinessError('ID do exercício é obrigatório');
    }

    if (!Number.isFinite(weight) || weight <= 0) {
      throw new BusinessError('Peso deve ser um número positivo');
    }

    if (!Number.isFinite(reps) || reps <= 0) {
      throw new BusinessError('Número de repetições deve ser positivo');
    }

    // Validações básicas com valores default seguros
    const data = {
      exerciseId: parseInt(exerciseId) || 0,
      weight: weight !== undefined ? Math.max(0, parseFloat(weight)) : 0,
      reps: parseInt(reps) || 0
    };

    logProgress('Dados normalizados:', data);

    // Validações de negócio aprimoradas
    if (data.reps <= 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: 'Número de repetições deve ser maior que 0'
      });
    }

    // Validação de peso máximo por segurança
    const MAX_WEIGHT = 500; // kg
    if (data.weight > MAX_WEIGHT) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: `Peso máximo permitido é ${MAX_WEIGHT}kg`
      });
    }

    // Validação de data/hora
    const now = new Date();
    const MIN_INTERVAL = 1000; // 1 segundo em milissegundos

    const lastProgressTime = await prisma.progress.findFirst({
      where: { exerciseId: data.exerciseId },
      orderBy: { date: 'desc' },
      select: { date: true }
    });

    if (lastProgressTime && (now - lastProgressTime.date) < MIN_INTERVAL) {
      return res.status(400).json({
        error: 'Taxa limite excedida',
        details: 'Por favor, aguarde um momento antes de registrar novo progresso'
      });
    }

    // Buscar exercício com workout
    const exercise = await prisma.exercise.findUnique({
      where: { id: data.exerciseId },
      include: { workout: true }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    if (exercise.workout.userId !== userId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    // Buscar o último progresso para determinar o próximo número da série
    const lastProgress = await prisma.progress.findFirst({
      where: { exerciseId: data.exerciseId },
      orderBy: { set: 'desc' }
    });

    // Calcular o próximo número da série
    const nextSet = lastProgress ? lastProgress.set + 1 : 1;

    // Verificar série duplicada (apenas para séries normais)
    if (nextSet <= exercise.sets) {
      const existingProgress = await prisma.progress.findFirst({
        where: { 
          exerciseId: data.exerciseId,
          set: nextSet
        }
      });

      if (existingProgress) {
        // Ao invés de retornar erro, vamos atualizar a série
        const updatedProgress = await prisma.progress.update({
          where: { id: existingProgress.id },
          data: {
            weight: data.weight,
            reps: data.reps
          }
        });

        const formattedProgress = {
          ...updatedProgress,
          date: formatDate(updatedProgress.date)
        };

        return res.json({
          success: true,
          progress: formattedProgress,
          message: 'Série atualizada com sucesso'
        });
      }
    }

    // Criar progresso com todos os dados necessários
    const progressData = {
      exerciseId: data.exerciseId,
      weight: data.weight,
      reps: data.reps,
      set: nextSet,
      userId: userId,
      workoutId: exercise.workoutId
    };

    // Log antes de salvar no banco
    logProgress('Salvando progresso', progressData);

    const progress = await prisma.progress.create({
      data: progressData,
      include: {
        exercise: true
      }
    });

    logProgress('Progresso salvo com sucesso', progress);

    // Verificar conclusão (modificado para séries extras)
    const allProgress = await prisma.progress.count({
      where: { exerciseId: data.exerciseId }
    });

    // Agora vamos permitir séries extras
    const isCompleted = allProgress >= exercise.sets;
    let message = nextSet > exercise.sets 
      ? `Série extra ${nextSet - exercise.sets} registrada com sucesso!` 
      : 'Progresso registrado com sucesso';
    let suggestedWeight = null;

    if (isCompleted && nextSet <= exercise.sets) {
      if (data.weight > 0) {
        suggestedWeight = data.weight + 1.25;
        message = `Parabéns! Você completou todas as séries. Sugerimos aumentar a carga para ${suggestedWeight}kg na próxima vez!`;
      } else {
        message = 'Parabéns! Você completou todas as séries!';
      }
    }

    const formattedProgress = {
      ...progress,
      date: formatDate(progress.date)
    };

    return res.json({
      success: true,
      progress: formattedProgress,
      message,
      suggestedWeight,
      isCompleted
    });

  } catch (error) {
    return handleError(error, res);
  }
};

// 📌 Atualizar progresso existente
export const updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { weight, reps } = req.body;
    const userId = req.user.id;

    console.log('📝 Iniciando atualização de progresso...');
    console.log('Dados recebidos:', { progressId, weight, reps, userId });

    // Validações básicas
    const data = {
      weight: weight !== undefined ? Math.max(0, parseFloat(weight)) : 0,
      reps: parseInt(reps) || 0
    };

    if (data.reps <= 0) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: 'Número de repetições deve ser maior que 0'
      });
    }

    // Buscar o progresso existente
    const existingProgress = await prisma.progress.findUnique({
      where: { id: parseInt(progressId) },
      include: {
        exercise: {
          include: { workout: true }
        }
      }
    });

    if (!existingProgress) {
      return res.status(404).json({ error: 'Progresso não encontrado' });
    }

    if (existingProgress.exercise.workout.userId !== userId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    // Atualizar o progresso
    const updatedProgress = await prisma.progress.update({
      where: { id: parseInt(progressId) },
      data: {
        weight: data.weight,
        reps: data.reps
      }
    });

    const formattedProgress = {
      ...updatedProgress,
      date: formatDate(updatedProgress.date)
    };

    return res.json({
      success: true,
      progress: formattedProgress,
      message: 'Progresso atualizado com sucesso'
    });

  } catch (error) {
    return handleError(error, res);
  }
};

// 📌 Listar progresso de um exercício específico
export const getExerciseProgress = async (req, res) => {
  const { exerciseId } = req.params;
  const userId = req.user.id;

  try {
    // Verificar se o exercício pertence a um treino do usuário
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) },
      include: {
        workout: true
      }
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercício não encontrado" });
    }

    if (exercise.workout.userId !== userId) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    // Buscar o progresso do exercício
    const progress = await prisma.progress.findMany({
      where: { exerciseId: parseInt(exerciseId) },
      orderBy: { set: 'asc' }
    });

    // Formatar as datas
    const formattedProgress = progress.map(p => ({
      ...p,
      date: formatDate(p.date)
    }));

    res.json(formattedProgress);
  } catch (error) {
    return handleError(error, res);
  }
};

// 📌 Listar histórico de progresso de um usuário
export const getUserProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const progress = await prisma.progress.findMany({
      where: {
        exercise: {
          workout: {
            userId: userId,
          },
        },
      },
      include: { exercise: true },
      orderBy: { date: "desc" },
    });

    // Formatar as datas
    const formattedProgress = progress.map(p => ({
      ...p,
      date: formatDate(p.date)
    }));

    res.json(formattedProgress);
  } catch (error) {
    return handleError(error, res);
  }
};
