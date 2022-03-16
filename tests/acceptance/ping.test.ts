import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';

import app from '../../src/app';

use(chaiAsPromised);

const requestWithSupertest = supertest(app);

describe('GET /ping', async () => {
  beforeEach(async () => {
    // something here
  });

  it('returns 200 even if X-API-SECRET is empty', async () => {
    const res = await requestWithSupertest.get('/ping').send();

    expect(res.status).to.eq(200);
  });
});
