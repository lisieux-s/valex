import { Request, Response } from "express";
import * as cardService from '../services/cardService.js'

export async function createCard(req: Request, res: Response) {
    const { id, type } = req.body;
    
    const result = await cardService.generateCardData(id, type);
    //console.log(result)
    res.sendStatus(201);
}