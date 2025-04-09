import { Router } from 'express';
import { listController } from './controllers/listController.js';
import { cardController } from './controllers/cardController.js';
import { tagController } from './controllers/tagController.js';

const router = Router();

router.get("/lists", listController.findAll);
router.get("/lists/:id", listController.findOne);
router.post("/lists/", listController.create);
router.patch("/lists/:id", listController.update);
router.delete("/lists/:id", listController.delete);

router.get("/cards", cardController.findAll);
router.get("/cards/:id", cardController.findOne);
router.post("/cards/", cardController.create);
router.patch("/cards/:id", cardController.update);
router.delete("/cards/:id", cardController.delete);
router.get("/lists/:id/cards", cardController.cardsByList);

router.get("/tags", tagController.findAll);
router.get("/tags/:id", tagController.findOne);
router.post("/tags/", tagController.create);
router.patch("/tags/:id", tagController.update);

export { router };