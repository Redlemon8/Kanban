import 'dotenv/config';
import express from 'express';
import { router } from "./src/router.js";
import cors from 'cors';
import { xss } from 'express-xss-sanitizer';
import { errorHandler, notFoundHandler } from './src/middlewares/handleError.js';

const app = express();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173"]
}));

app.use(xss());

app.use(router);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Listening on ${process.env.BASE_URL}:${process.env.PORT}`);
});