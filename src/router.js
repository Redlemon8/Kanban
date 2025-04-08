import { Router } from 'express';
import { listController } from './controllers/listController.js';

const router = Router();

router.get('/lists', listController.index);

export { router };