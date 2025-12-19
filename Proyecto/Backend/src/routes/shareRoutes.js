import express from 'express';
const router = express.Router();
import {
  generarTokenCompartir,
  obtenerEnsambleCompartido,
  desactivarCompartir,
} from '../controllers/shareController.js';

router.post('/share-ensamble/:id', generarTokenCompartir);
router.get('/shared/:token', obtenerEnsambleCompartido);
router.delete('/share-ensamble/:id', desactivarCompartir);

export default router;
