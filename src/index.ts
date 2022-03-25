import * as cron from 'cron';
import { config } from 'dotenv';

import app from './app';
import { checkAndProcessCsvFiles } from './utils/cron';

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  return console.log(
    `The application is listening at http://localhost:${PORT}`
  );
});

const task = new cron.CronJob('* * * * *', async () => {
  await checkAndProcessCsvFiles();
});

task.start();

/* eslint-disable-next-line no-console */
console.log(task.running ? 'Cron is running.' : 'Cron is not running.');
