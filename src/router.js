import { Router } from 'express';
import { listController } from './controllers/listController.js';

const router = Router();

router.get("/lists", listController.findAll);
router.get("/lists/:id", listController.findOne);
router.post("/lists/", listController.create);
router.patch("/lists/:id", listController.update);
router.delete("/lists/:id", listController.delete);

router.get("/cards", listController.findAll);
router.get("/cards/:id", listController.findOne);

export { router };