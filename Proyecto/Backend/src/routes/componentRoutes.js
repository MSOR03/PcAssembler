import { Router } from 'express';
import { getMotherBoards } from '../controllers/motherBoardController.js';
import { getCPUsCompatibles } from '../controllers/cpuController.js';
import { getGPUsCompatibles } from '../controllers/gpuController.js';
import { getTopComponents, getAllComponents, getComponentById } from '../controllers/componentController.js';
import { getMemoryCompatibles } from '../controllers/memoryController.js';
import { getDisksCompatibles } from '../controllers/storageController.js';
import { getCompatiblePSUs } from '../controllers/powerSupplyController.js';
import { getCompatibleCases } from '../controllers/caseController.js';
import { getCompatibleMonitors } from '../controllers/monitorController.js';

const router = Router();

router.get("/boards", getMotherBoards);
router.post("/cpus-compatibles", getCPUsCompatibles);
router.post("/gpus-compatibles", getGPUsCompatibles);
router.post("/get-memory-compatibles", getMemoryCompatibles);
router.post("/get-compatible-disks", getDisksCompatibles);
router.post("/get-compatible-psus", getCompatiblePSUs);
router.post("/get-compatible-cases", getCompatibleCases);
router.post("/get-compatible-monitors", getCompatibleMonitors);
router.get('/top-components', getTopComponents);
router.get('/componentes', getAllComponents);
router.get('/componente/:id', getComponentById);

export default router;