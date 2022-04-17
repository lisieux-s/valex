import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(
    error, 
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(error.type === 'CONFLICT') {
        return res.sendStatus(409);
    } else if(error.type === 'NOT_FOUND') {
        return res.sendStatus(404);
    }
    console.log(error);
    res.sendStatus(500);

    next();
}