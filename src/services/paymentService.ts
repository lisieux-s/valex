import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

import * as cardRepository from '../repositories/cardRepository.js';
import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

import * as cardService from './cardService.js';

export async function payPOS(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  if (!cardId || !password || !businessId || !amount) {
    throw { type: 'UNPROCESSABLE_ENTITY' };
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
    throw { type: 'UNAUTHORIZED' };
  }

  return;
}

export async function payOnline(
  number: string,
  cardholderName: string,
  expirationDate: string,
  securityCode: number,
  businessId: number,
  amount: number
) {
  if (
    !number ||
    !cardholderName ||
    !expirationDate ||
    !securityCode ||
    !businessId ||
    !amount
  ) {
    throw { type: 'UNPROCESSABLE_ENTITY' };
  }

  const cardData = await cardRepository.findByCardDetails(
    number,
    cardholderName,
    expirationDate
  );

  const cardId = cardData.id;

  const cardType = await checkCard(cardId, businessId.toString());
  await checkBusiness(businessId, cardType);

  const balance = (await cardService.getBalance(cardId)).balance;
  if (balance >= amount) {
    await paymentRepository.insert({
      cardId,
      businessId,
      amount,
    });
  } else {
    throw { type: 'UNAUTHORIZED' };
  }
}

async function checkCard(
  cardId: number,
  password: string = null,
  securityCode: string = null
) {
  const result = await cardRepository.findById(cardId);
  if (!result) {
    throw { type: 'NOT_FOUND' };
  } else if (cardService.isExpired(result.expirationDate)) {
    throw { type: 'UNAUTHORIZED' };
  } else if (result.isBlocked) {
    throw { type: 'UNAUTHORIZED' };
  } else if (password) {
    if (!bcrypt.compareSync(password, result.password)) {
      throw { type: 'UNAUTHORIZED' };
    }
  } else if (securityCode) {
    if (!bcrypt.compareSync(securityCode, result.securityCode)) {
      throw { type: 'UNAUTHORIZED' };
    }
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

async function checkBalance(cardId: number) {

}