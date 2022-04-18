import { Request, Response } from 'express';

import * as paymentService from '../services/paymentService.js';

export async function pay(req: Request, res: Response) {
    const { cardId, password, businessId, amount } = req.body;
  await paymentService.pay(cardId, password, businessId, amount);
  res.sendStatus(201);
}
