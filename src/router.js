import { Router } from 'express';
import { listController } from './controllers/listController.js';
import { cardController } from './controllers/cardController.js';
import { tagController } from './controllers/tagController.js';
import { cw } from './middlewares/handleError.js';
import { createListSchema, updateListSchema } from './schemas/listSchemas.js';
import { validate } from './middlewares/validation.js';
import { createCardSchema, updateCardSchema } from './schemas/cardSchemas.js';
import { createTagSchema, updateTagSchema } from './schemas/tagSchemas.js';

const router = Router();

router.get("/lists", cw(listController.findAll));
router.get("/lists/:id", cw(listController.findOne));
router.post("/lists/", validate(createListSchema), cw(listController.create));
router.patch("/lists/:id", validate(updateListSchema), cw(listController.update));
router.delete("/lists/:id", cw(listController.delete));

router.get("/cards", cw(cardController.findAll));
router.get("/cards/:id", cw(cardController.findOne));
router.post("/cards/", validate(createCardSchema), cw(cardController.create));
router.patch("/cards/:id", validate(updateCardSchema), cw(cardController.update));
router.delete("/cards/:id", cw(cardController.delete));
router.get("/lists/:id/cards", cw(cardController.cardsByList));

router.get("/tags", cw(tagController.findAll));
router.get("/tags/:id", cw(tagController.findOne));
router.post("/tags/", validate(createTagSchema), cw(tagController.create));
router.patch("/tags/:id", validate(updateTagSchema), cw(tagController.update));
router.delete("/tags/:id", cw(tagController.delete));
router.put("/cards/:cards_id/tags/:tags_id", cw(tagController.linkTagToCard));
router.delete("/cards/:cards_id/tags/:tags_id", cw(tagController.deleteTagToCard));


export { router };