import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createWorkout, getWorkouts, getWorkoutOfTheDay, deleteWorkout, updateWorkout } from "../controllers/workoutController.js";

const router = express.Router();

// Rotas protegidas
router.use(protect);
router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/workout-today", getWorkoutOfTheDay);
router.delete("/:id", deleteWorkout);
router.put("/:id", updateWorkout);

export default router;
