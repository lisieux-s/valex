import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(
    error, 
    req: Request,
    res: Response,
    next: NextFunction
) {
    

    next();
}