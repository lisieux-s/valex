import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

import * as cardRepository from '../repositories/cardRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

import * as cardService from './cardService.js';

export async function pay(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {

  if(!cardId || !password || !businessId || !amount) {
    throw { type: 'UNPROCESSABLE_ENTITY' }
  }

  const cardType = await checkCard(cardId, password);
  await checkBusiness(businessId, cardType);

  const balance = (await cardService.getBalance(cardId)).balance;
  if (balance >= amount) {
    await paymentRepository.insert({
      cardId,
      businessId,
      amount,
    });
  } else {
    throw { type: 'UNAUTHORIZED' }
  }

  return;
}

async function checkCard(cardId: number, password: string) {
  const result = await cardRepository.findById(cardId);
  if (!result) {
    throw { type: 'NOT_FOUND' };
  } else if (cardService.isExpired(result.expirationDate)) {
    throw { type: 'UNAUTHORIZED' };
  } else if (!bcrypt.compareSync(password, result.password)) {
    throw { type: 'UNAUTHORIZED' };
  } else if(result.isBlocked) {
    throw { type: 'UNAUTHORIZED' }
  }

  return result.type;
}

async function checkBusiness(businessId: number, cardType: string) {
  const result = await businessRepository.findById(businessId);
  if (!result) {
    throw { type: 'NOT_FOUND' };
  } else if (cardType !== result.type) {
    throw { type: 'UNAUTHORIZED' };
  }
}