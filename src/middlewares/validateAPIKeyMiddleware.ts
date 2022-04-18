import { NextFunction, Request, Response } from "express";

import * as companyRepository from '../repositories/companyRepository.js'

export async function validateAPIKeyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const APIKey = req.headers['x-api-key']?.toString();
    const id = req.headers.id?.toString();

    if(!APIKey) {
        throw { type: 'UNAUTHORIZED' }
    }

    await isKeyValid(APIKey, id)
    next();
  
}

async function isKeyValid(APIKey: string, companyId: string) {
    const result = await companyRepository.findByApiKey(APIKey);
    if(!result) {
        throw { type: 'UNAUTHORIZED' }
    } else if(result.id !== parseInt(companyId)) {
        throw { type: 'UNAUTHORIZED' }
    }
}