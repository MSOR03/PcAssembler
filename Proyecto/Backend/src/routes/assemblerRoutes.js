import { Router } from 'express';
import { registrarEnsamble, obtenerEnsamblesUsuario, eliminarEnsamble, modificarEnsamble } from "../controllers/assemblerController.js"; // Asegúrate de incluir .js

const router = Router();

router.post("/registrar-ensamble", registrarEnsamble);
router.get("/obtener-ensambles-usuario", obtenerEnsamblesUsuario);
router.delete("/eliminar-ensamble/:id_ensamble", eliminarEnsamble);
router.put("/modificar-ensamble/:id_ensamble", modificarEnsamble);
//Ver historial de compra
export default router;
