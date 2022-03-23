import { config } from 'dotenv';

config();

export const ADD_SCHEDULE_INTERVAL = parseInt(
  process.env.ADD_SCHEDULE_INTERVAL || '3000'
);

export const USE_REFRESH_TOKEN = parseInt(process.env.USE_REFRESH_TOKEN || '0');