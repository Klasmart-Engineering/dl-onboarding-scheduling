import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export const fileIsRequired = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const file = req.file;

  if (!file) {
    throw createError(400, { message: 'File is required.' });
  }

  next();
};
