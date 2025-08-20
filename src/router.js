import { Router } from 'express';
import { listController } from './controllers/listController.js';
import { cardController } from './controllers/cardController.js';
import { tagController } from './controllers/tagController.js';
import { cw } from './middlewares/handleError.js';
import { createListSchema, updateListSchema } from './schemas/listSchemas.js';
import { validate } from './middlewares/validation.js';
import { createCardSchema, updateCardSchema } from './schemas/cardSchemas.js';
import { createTagSchema, updateTagSchema } from './schemas/tagSchemas.js';
import projectController from './controllers/projectController.js';
import { createProjectSchema, updateProjectSchema } from './schemas/projectSchema.js';
import userController from './controllers/userController.js';
import { createUserSchema, updateUserSchema } from './schemas/userSchema.js';
import { authenticateToken } from './middlewares/auth.js';

const router = Router();

router.post("/auth/register", validate(createUserSchema), cw(userController.register));
router.post("/auth/login", cw(userController.login));
router.post("/auth/refresh", cw(userController.refreshToken));
router.post("/auth/logout", cw(userController.logout));
router.post("/auth/logout-all", authenticateToken, cw(userController.logoutAll));

router.get("/users", authenticateToken, cw(userController.findAll));
router.get("/users/:id", authenticateToken, cw(userController.findOne));
router.post("/users/", authenticateToken, validate(createUserSchema), cw(userController.create));
router.patch("/users/:id", authenticateToken, validate(updateUserSchema), cw(userController.update));
router.delete("/users/:id", authenticateToken, cw(userController.delete));

router.get("/projects", authenticateToken, cw(projectController.findAll));
router.get("/projects/:id", authenticateToken, cw(projectController.findOne));
router.post("/projects/", authenticateToken, validate(createProjectSchema), cw(projectController.create));
router.patch("/projects/:id", authenticateToken, validate(updateProjectSchema), cw(projectController.update));
router.delete("/projects/:id", authenticateToken, cw(projectController.delete));


router.get("/projects/:id/lists", authenticateToken, cw(listController.findAll));
router.get("/projects/:projectId/lists/:id", authenticateToken, cw(listController.findOne));
router.post("/projects/:id/lists", authenticateToken, validate(createListSchema), cw(listController.create));
router.patch("/projects/:projectId/lists/:id", authenticateToken, validate(updateListSchema), cw(listController.update));
router.delete("/projects/:projectId/lists/:id", authenticateToken, cw(listController.delete));

router.get("/cards", authenticateToken, cw(cardController.findAll));
router.get("/cards/:id", authenticateToken, cw(cardController.findOne));
router.post("/cards/", authenticateToken, validate(createCardSchema), cw(cardController.create));
router.patch("/cards/:id", authenticateToken, validate(updateCardSchema), cw(cardController.update));
router.delete("/cards/:id", authenticateToken, cw(cardController.delete));
router.get("/lists/:id/cards", authenticateToken, cw(cardController.cardsByList));

router.get("/tags", authenticateToken, cw(tagController.findAll));
router.get("/tags/:id", authenticateToken, cw(tagController.findOne));
router.post("/tags/", authenticateToken, validate(createTagSchema), cw(tagController.create));
router.patch("/tags/:id", authenticateToken, validate(updateTagSchema), cw(tagController.update));
router.delete("/tags/:id", authenticateToken, cw(tagController.delete));
router.put("/cards/:card_id/tags/:tag_id", authenticateToken, cw(tagController.linkTagToCard));
router.delete("/cards/:card_id/tags/:tag_id", authenticateToken, cw(tagController.deleteTagToCard));


export { router };