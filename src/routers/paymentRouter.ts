import { Router } from "express";

import * as paymentController from '../controllers/paymentController.js'

const paymentRouter = Router();

paymentRouter.post('/pay', paymentController.pay);

export default paymentRouter;