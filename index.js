import 'dotenv/config';
import express from 'express';
import { router } from "./src/router.js";
import cors from 'cors';
import { xss } from 'express-xss-sanitizer';
import { errorHandler, notFoundHandler } from './src/middlewares/handleError.js';
import { requestLogger } from './src/middlewares/logger.js';
import logger from './src/utils/logger.js';

const app = express();

// Log du démarrage de l'application
logger.info('🚀 Démarrage de l\'application Kanban');

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173"]
}));

app.use(xss());

// Middleware de logging des requêtes HTTP
app.use(requestLogger);

app.use(router);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  logger.info(`🚀 Serveur démarré sur ${process.env.BASE_URL}:${process.env.PORT}`);
});

export default app;