import dayjs from 'dayjs'

import * as cardRepository from '../repositories/cardRepository.js'
import * as rechargeRepository from '../repositories/rechargeRepository.js'

import * as cardService from '../services/cardService.js'

export async function recharge(cardId: number, amount: number) {
    if(amount <= 0) {
        throw { type: 'UNPROCESSABLE_ENTITY' }
    }
    await checkCard(cardId);

    await rechargeRepository.insert({
        cardId,
        amount
    })

    return;
}

async function checkCard(id: number) {
    const result = await cardRepository.findById(id)
    if(!result) {
        throw { type: 'NOT_FOUND'}
    } else if(cardService.isExpired(result.expirationDate)) {
        throw { type: 'UNAUTHORIZED' }
    }
}