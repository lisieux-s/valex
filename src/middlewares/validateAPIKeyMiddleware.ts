import { NextFunction, Request, Response } from "express";

import * as companyRepository from '../repositories/companyRepository.js'

export async function validateAPIKeyMiddleware(
    error, 
    req: Request,
    res: Response,
    next: NextFunction
) {
    const APIKey = req.headers['x-api-key'][0];

    await isKeyValid(APIKey)
  
    next();
}

async function isKeyValid(APIKey: string) {
    if(!await companyRepository.findByApiKey(APIKey)) {
        throw { type: 'UNAUTHORIZED' }
    }
}