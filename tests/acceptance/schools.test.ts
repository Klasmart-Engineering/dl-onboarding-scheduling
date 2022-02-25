import fs from 'fs';
import path from 'path';

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';
import supertest from 'supertest';

import app from '../../src/app';

use(chaiAsPromised);

// Override environment variables
const envConfig = dotenv.parse(
  fs.readFileSync(path.resolve(__dirname, '../../.env.test'))
);

for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const requestWithSupertest = supertest(app);

describe('GET /schools', () => {
  beforeEach(async () => {
    // something here
  });

  it('returns 200', async () => {
    const res = await requestWithSupertest.get('/schools').send();

    expect(res.status).to.eq(200);
    expect(res.body.message).is.not.empty;
  });
});
