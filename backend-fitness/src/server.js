import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// Middlewares globais
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas de saúde da API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API está funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/progress', progressRoutes);

// Middleware de tratamento de rotas não encontradas
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Não foi possível encontrar ${req.originalUrl} neste servidor!`
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Iniciar o servidor
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando no modo ${config.nodeEnv}`);
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
