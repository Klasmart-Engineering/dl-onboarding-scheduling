import app from './app';
// import './utils/dotenv';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  return console.log(
    `The application is listening at http://localhost:${PORT}`
  );
});
