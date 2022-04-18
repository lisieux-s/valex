import dayjs from 'dayjs'

import * as cardRepository from '../repositories/cardRepository.js'
import * as rechargeRepository from '../repositories/rechargeRepository.js'

export async function recharge(cardId: number, amount: number) {
    checkCard(cardId);

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
    } else if(dayjs().diff(result.expirationDate, 'years') > 5) {
        throw { type: 'UNAUTHORIZED' }
    }
}