import express from 'express';
import { evaluarEnsamble, obtenerHistorialEvaluaciones, obtenerEvaluacionEnsamble } from '../controllers/aiEvaluationController.js';

const router = express.Router();

// Rutas protegidas (la autenticación se verifica en el controller)
router.post('/evaluar-ensamble', evaluarEnsamble);
router.get('/historial-evaluaciones', obtenerHistorialEvaluaciones);
router.get('/evaluacion-ensamble/:ensambleId', obtenerEvaluacionEnsamble);

export default router;
