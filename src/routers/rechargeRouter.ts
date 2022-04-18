import { Router } from "express";

import * as rechargeController from '../controllers/rechargeController.js'

const rechargeRouter = Router();

rechargeRouter.post('/recharge', rechargeController.recharge);

export default rechargeRouter;