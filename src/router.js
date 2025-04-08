import { Router } from 'express';
import { listController } from './controllers/listController.js';

const router = Router();

router.get('/lists', listController.index);
router.get('/lists/:id', listController.show);

export { router };