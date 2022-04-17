import faker from '@faker-js/faker';
import bcrypt from 'bcrypt'
import dayjs from 'dayjs';

import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import { TransactionTypes } from '../repositories/cardRepository';

export async function generateCardData(employeeId: number, type: TransactionTypes) {
  const name = await findEmployee(employeeId);
  checkUniqueCard(type, employeeId);

  const number = await generateCardNumber();
  const cardholderName = formatName(name);
  const expirationDate = generateExpirationDate();
  const securityCode = generateSecurityCode();
  const securityCodeHash = bcrypt.hashSync(securityCode, 10)

  // console.log(number);
  // console.log(cardholderName);
  // console.log(expirationDate)
  // console.log(securityCode);

  const cardData = {
    employeeId,
    number,
    cardholderName,
    securityCode: securityCodeHash,
    expirationDate,
    password: '00',
    isVirtual: false,
    isBlocked: false,
    type
  }

  //await cardRepository.insert(cardData);
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
    throw { type: 'BAD_REQUEST?' };
  }
}

async function generateCardNumber() {
  let cardNumber = faker.finance.creditCardNumber('mastercard');
  while(await checkCardNumber(cardNumber)) {
    cardNumber = faker.finance.creditCardNumber('mastercard');
  }
  return cardNumber;
}

function formatName(name: string) {
  let cardholderName = name.toUpperCase()
  let cardholderNameArr = cardholderName.split(' ');
  cardholderNameArr = cardholderNameArr.filter((name) => name.length > 2)
  cardholderNameArr.forEach((name, i) => {
    if(i !== 0 && i !== cardholderNameArr.length - 1) {
      cardholderNameArr[i] = name[0];
    }
  })
  return cardholderNameArr.join(' ')
}

function generateExpirationDate() {
  return dayjs().add(5, 'year').toString()
}

function generateSecurityCode() {
  return faker.finance.creditCardCVV();
}

async function checkCardNumber(cardNumber: string) {
  const result = await cardRepository.find();
  console.log(result);
  return(result.find(card => card.number === cardNumber));
}
