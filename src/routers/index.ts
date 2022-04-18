import { Router } from 'express';
import cardRouter from './cardRouter.js';
import rechargeRouter from './rechargeRouter.js';
import paymentRouter from './paymentRouter.js';

const router = Router();
router.use(cardRouter);
router.use(rechargeRouter);
router.use(paymentRouter);

export default router;
