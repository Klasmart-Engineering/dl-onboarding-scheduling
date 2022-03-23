import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export const orgIDRequired = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const orgID = req.query.org_id;
  if (!orgID) {
    throw createError(400, { message: `org_id param is required` });
  }
  next();
};
