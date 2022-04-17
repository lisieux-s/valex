import { Router } from "express";
import * as cardController from '../controllers/cardController.js'

const cardRouter = Router();

cardRouter.post("/create-card", cardController.createCard)

export default cardRouter;