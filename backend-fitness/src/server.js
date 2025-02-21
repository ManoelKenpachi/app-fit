import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 📌 Rotas da API
app.use("/auth", authRoutes);
app.use("/api", workoutRoutes);
app.use("/api", exerciseRoutes);
app.use("/api", progressRoutes);

// 📌 Definir porta do servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
