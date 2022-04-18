import { Request, Response } from "express";
import * as cardService from '../services/cardService.js'

export async function createCard(req: Request, res: Response) {
    try {
        const { id, type } = req.body;
        if(!id || !type) {
            throw { type: 'UNPROCESSABLE_ENTITY' }
        }
        
        await cardService.generateCardData(id, type);
        res.sendStatus(201);
    } catch(error) {
        return res.status(500).send(error)
    }
}

export async function updateCard(req: Request, res: Response) {
    const { id, securityCode, password } = req.body;
    if(!id || !securityCode || !password) {
        throw { type: 'UNPROCESSABLE_ENTITY' }
    }

    await cardService.updateCard(id, securityCode, password);
    res.sendStatus(200);
}

export async function getBalance(req: Request, res: Response) {
    const { id } = req.body;
    if(!id) {
        throw { type: 'UNPROCESSABLE_ENTITY' }
    }

    const result = await cardService.getBalance(id);
    res.send(result);
}

export async function blockCard(req: Request, res: Response) {
    const { id, password } = req.body;
    await cardService.toggleBlockCard(id, password, true);
    res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
    const { id, password } = req.body;
    await cardService.toggleBlockCard(id, password, false);
    res.sendStatus(200);
}