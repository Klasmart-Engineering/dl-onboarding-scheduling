import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';

import app from '../../src/app';

use(chaiAsPromised);

const requestWithSupertest = supertest(app);

describe('POST /schedules', () => {
  describe('return 401', () => {
    it('return 401 error if X-API-SECRET is empty', async () => {
      const res = await requestWithSupertest.post('/schedules');
      expect(res.status).to.eq(401);
    });

    it('return 401 error if the X-API-SECRET is invalid', async () => {
      const res = await requestWithSupertest
        .post('/schedules')
        .set('X-API-SECRET', 'invalid');

      expect(res.status).to.eq(401);
    });
  });
  describe('return 400', () => {
    it('return 400 error when the file is missing', async () => {
      const res = await requestWithSupertest
        .post('/schedules')
        .set('X-API-SECRET', process.env.API_SECRET || 'API_SECRET');

      expect(res.status).to.eq(400);
    });
  });
});
