import express, { NextFunction, Request, Response } from 'express';
import createError, { HttpError } from 'http-errors';
import multer from 'multer';

import { checkAPISecret } from './middlewares/checkAPISecret';
import indexRouter from './routes';

const app = express();

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
const unless = (middleware: MiddlewareFunction, ...paths: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const pathCheck = paths.some((path) => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(unless(checkAPISecret, '/ping'));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((_: Request, __: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, _: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let status = 500;
  switch (err.constructor) {
    case multer.MulterError:
      status = 400;
      break;

    default:
      break;
  }
  if (err.status) status = err.status;

  res.status(status);
  res.json({ message: err.message });
});

export default app;
