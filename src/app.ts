import express, { NextFunction, Request, Response } from 'express';
import createError, { HttpError } from 'http-errors';

import indexRouter from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((_: Request, __: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, _: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(`error ${err.status}: ${err.message}`);
});

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  return console.log(
    `The application is listening at http://localhost:${PORT}`
  );
});
