import { Router } from "express";
import * as cardController from '../controllers/cardController.js'

const cardRouter = Router();

cardRouter.post("/create-card", cardController.createCard)
cardRouter.put('/activate-card', cardController.updateCard)

export default cardRouter;