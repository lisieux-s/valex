import { Request, Response } from "express";
import * as cardService from '../services/cardService.js'

export async function createCard(req: Request, res: Response) {
    const { id, type } = req.body;
    
    await cardService.generateCardData(id, type);
    res.sendStatus(201);
}

export async function updateCard(req: Request, res: Response) {
    const { id, securityCode, password } = req.body;

    await cardService.updateCard(id, securityCode, password);
    res.sendStatus(200);
}

export async function getBalance(req: Request, res: Response) {
    const { id } = req.body;

    const result = await cardService.getBalance(id);
    res.send(result);
}