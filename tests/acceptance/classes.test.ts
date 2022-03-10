import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';

import app from '../../src/app';

use(chaiAsPromised);

const requestWithSupertest = supertest(app);

describe('POST /classes', () => {
  beforeEach(async () => {
    // something here
  });

  describe('returns 401', () => {
    it('returns 401 error if X_API_SECRET is empty', async () => {
      const res = await requestWithSupertest
        .post('/classes')
        .attach('file', 'tests/fixtures/example.csv');

      expect(res.status).to.eq(401);
    });

    it('returns 401 error if X_API_SECRET is invalid', async () => {
      const res = await requestWithSupertest
        .post('/classes')
        .set('X_API_SECRET', 'invalid')
        .attach('file', 'tests/fixtures/example.csv');

      expect(res.status).to.eq(401);
    });
  });

  describe('returns 400', () => {
    it('when the file is missing', async () => {
      const res = await requestWithSupertest
        .post('/classes')
        .set('X_API_SECRET', process.env.API_SECRET || 'API_SECRET')
        .send();

      expect(res.status).to.eq(400);
      expect(res.body.message).is.eq('File is required.');
    });

    it('when the file is not CSV', async () => {
      const res = await requestWithSupertest
        .post('/classes')
        .set('X_API_SECRET', process.env.API_SECRET || 'API_SECRET')
        .attach('file', 'tests/fixtures/example.txt');

      expect(res.status).to.eq(400);
      expect(res.body.message).is.eq('Please upload only CSV file.');
    });
  });
});
