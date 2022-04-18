import { Router } from "express";

import * as paymentController from '../controllers/paymentController.js'

const paymentRouter = Router();

paymentRouter.post('/pay/POS', paymentController.payPOS);
paymentRouter.post('/pay/online', paymentController.payOnline)

export default paymentRouter;