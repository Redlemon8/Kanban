import 'dotenv/config';
import express from 'express';
import { router } from "./src/router.js";

const app = express();

app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Listening on ${process.env.BASE_URL}:${process.env.PORT}`);
});