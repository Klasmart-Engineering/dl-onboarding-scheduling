import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';

import app from '../../src/app';

use(chaiAsPromised);

const requestWithSupertest = supertest(app);

describe('GET /contents_folders', () => {
  describe('return 401', () => {
    it('return 401 error if X-API-SECRET is empty', async () => {
      const res = await requestWithSupertest.get('/contents_folders');
      expect(res.status).to.eq(401);
    });

    it('return 401 error if the X-API-SECRET is invalid', async () => {
      const res = await requestWithSupertest
        .get('/contents_folders')
        .set('X-API-SECRET', 'invalid');

      expect(res.status).to.eq(401);
    });
  });

  describe('return 400', () => {
    it('return 400 error if the org_id is empty', async () => {
      const res = await requestWithSupertest
        .get('/contents_folders')
        .query({ org_id: '' })
        .set('X-API-SECRET', process.env.API_SECRET || 'API_SECRET');

      expect(res.status).to.eq(400);
    });
  });

  it('return 200 and get lesson plans successfully', async () => {
    const res = await requestWithSupertest
      .get('/contents_folders')
      .query({ org_id: '051f6f59-ddf7-4d4a-9b88-d536235bae43' })
      .set('X-API-SECRET', process.env.API_SECRET || 'API_SECRET');
    expect(res.status).to.eq(200);
  });
});
