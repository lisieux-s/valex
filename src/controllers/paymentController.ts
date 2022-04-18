import { Request, Response } from 'express';

import * as paymentService from '../services/paymentService.js';

export async function payPOS(req: Request, res: Response) {
  const { cardId, password, businessId, amount } = req.body;
  await paymentService.payPOS(cardId, password, businessId, amount);
  res.sendStatus(201);
}

export async function payOnline(req: Request, res: Response) {
  const {
    number,
    cardholderName,
    expirationDate,
    securityCode,
    businessId,
    amount,
  } = req.body;
  await paymentService.payOnline(
    number,
    cardholderName,
    expirationDate,
    securityCode,
    businessId,
    amount
  );
  res.sendStatus(201);
}
