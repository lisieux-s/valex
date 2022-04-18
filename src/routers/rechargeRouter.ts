import { Router } from "express";

import * as rechargeController from '../controllers/rechargeController.js'
import { validateAPIKeyMiddleware } from '../middlewares/validateAPIKeyMiddleware.js'

const rechargeRouter = Router();

rechargeRouter.post('/recharge', validateAPIKeyMiddleware, rechargeController.recharge);

export default rechargeRouter;