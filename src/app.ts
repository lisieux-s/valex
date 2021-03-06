import cors from 'cors';
import express, { json, NextFunction, request, Request, Response } from 'express';
import 'express-async-errors';

import router from './routers/index.js';

import { handleErrorMiddleware } from './middlewares/handleErrorMiddleware.js';

const app = express();
app.use(cors());
app.use(json());
app.use(router);
app.use(handleErrorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})