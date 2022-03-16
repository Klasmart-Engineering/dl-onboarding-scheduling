import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export const checkAPISecret = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const apiSecret = req.get('X-API-SECRET');

  if (apiSecret !== process.env.API_SECRET) {
    throw createError(401, { message: 'Unauthorized.' });
  }

  next();
};
