import { Router } from 'express';

import * as cardController from '../controllers/cardController.js';

import { validateAPIKeyMiddleware } from '../middlewares/validateAPIKeyMiddleware.js';

const cardRouter = Router();

cardRouter.post(
  '/create-card',
  validateAPIKeyMiddleware,
  cardController.createCard
);
cardRouter.put('/activate-card', cardController.updateCard);
cardRouter.get('/balance', cardController.getBalance);

cardRouter.post('/block', cardController.blockCard);
cardRouter.post('/unblock', cardController.unblockCard)

export default cardRouter;
