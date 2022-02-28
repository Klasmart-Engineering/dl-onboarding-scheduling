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

describe('POST /organizations', async () => {
  beforeEach(async () => {
    // something here
  });

  it('returns 401 error if X_API_SECRET is empty', async () => {
    const res = await requestWithSupertest
      .post('/organizations')
      .send({ name: 'organization' });

    expect(res.status).to.eq(401);
  });

  it('returns 401 error if X_API_SECRET is invalid', async () => {
    const res = await requestWithSupertest
      .post('/organizations')
      .set('X_API_SECRET', 'invalid')
      .send({ name: 'organization' });

    expect(res.status).to.eq(401);
  });

  it('returns 400 error if name is empty', async () => {
    const res = await requestWithSupertest
      .post('/organizations')
      .set('X_API_SECRET', process.env.API_SECRET || 'API_SECRET')
      .send({ name: '' });

    expect(res.status).to.eq(400);
  });
});
