import faker from '@faker-js/faker';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { TransactionTypes } from '../repositories/cardRepository';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';

export async function generateCardData(
  employeeId: number,
  type: TransactionTypes
) {
  const name = await findEmployee(employeeId);
  checkUniqueCard(type, employeeId);

  const number = await generateCardNumber();
  const cardholderName = formatName(name);
  const expirationDate = dayjs().add(5, 'year').format('MM/YY').toString();
  const securityCode = faker.finance.creditCardCVV();
  const securityCodeHash = bcrypt.hashSync(securityCode, 10);

  console.log(securityCode);

  const cardData = {
    employeeId,
    number,
    cardholderName,
    securityCode: securityCodeHash,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  };

  await cardRepository.insert(cardData);
  return cardData;
}

async function findEmployee(id: number) {
  const result = await employeeRepository.findById(id);
  if (!result) {
    throw { type: 'NOT_FOUND' };
  } else {
    return result.fullName;
  }
}

async function checkUniqueCard(type: TransactionTypes, id: number) {
  if (await cardRepository.findByTypeAndEmployeeId(type, id)) {
    throw { type: 'CONFLICT' };
  }
}

async function generateCardNumber() {
  let cardNumber = faker.finance.creditCardNumber('mastercard');
  while (await checkCardNumber(cardNumber)) {
    cardNumber = faker.finance.creditCardNumber('mastercard');
  }
  return cardNumber;
}

function formatName(name: string) {
  let cardholderName = name.toUpperCase();
  let cardholderNameArr = cardholderName.split(' ');
  cardholderNameArr = cardholderNameArr.filter((name) => name.length > 2);
  cardholderNameArr.forEach((name, i) => {
    if (i !== 0 && i !== cardholderNameArr.length - 1) {
      cardholderNameArr[i] = name[0];
    }
  });
  return cardholderNameArr.join(' ');
}

async function checkCardNumber(cardNumber: string) {
  const result = await cardRepository.find();
  console.log(result);
  return result.find((card) => card.number === cardNumber);
}

export async function updateCard(
  id: number,
  securityCode: string,
  password: string
) {
  console.log(securityCode)
  const passwordHash = bcrypt.hashSync(password, 10);
  await checkCardAndSecurityCode(id, securityCode);
  await cardRepository.update(id, { securityCode, password: passwordHash });
}

async function checkCardAndSecurityCode(id: number, securityCode: string) {
  const result = await cardRepository.findById(id);
  console.log(result)
  console.log(result.securityCode)
  
  if (
    !result 
    //|| dayjs().diff(result.expirationDate, 'years') > 5 yeah thats not workin 
    || result.password 
    || !bcrypt.compareSync(securityCode.toString(), result.securityCode)
  ) {
    throw { type: 'UNAUTHORIZED' };
  }

}

export async function getBalance(cardId: number) {
  const transactionsResult = await paymentRepository.findByCardId(cardId);
  const rechargesResult = await rechargeRepository.findByCardId(cardId);
  
  const transactions = sumByKey(transactionsResult, 'amount');
  const recharges = sumByKey(rechargesResult, 'amount');

  const balance = recharges - transactions;
  
  return({
    balance,
    transactions,
    recharges
  })
}

function sumByKey(object, key: string) {
  const values = [];
  object.map((item) => values.push(item.amount));
  return values.reduce((previous: number, current: number) => previous + current, 0)
}