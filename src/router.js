import { Router } from 'express';
import { listController } from './controllers/listController.js';

const router = Router();

router.get("/lists", listController.index);
router.get("/lists/:id", listController.show);
router.post("/lists/", listController.create);
router.patch("/lists/:id", listController.update);
router.delete("/lists/:id", listController.delete);

export { router };