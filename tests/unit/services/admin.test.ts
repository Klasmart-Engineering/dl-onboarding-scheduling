import fs from 'fs';
import path from 'path';

import chai, { expect } from 'chai';
import spies from 'chai-spies';
import dotenv from 'dotenv';

import { AdminService } from '../../../src/services';
import { adminServiceServer } from '../../mocks/adminServiceServer';

chai.use(spies);

// Override environment variables
const envConfig = dotenv.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../.env.test'))
);
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

describe('AdminService', () => {
  // Establish API mocking before all tests.
  before(() => adminServiceServer.listen());

  // Clean up after the tests are finished.
  after(() => adminServiceServer.close());

  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => adminServiceServer.resetHandlers());

  describe('#getOrganizations', () => {
    it('returns all organizations when has pagination', async () => {
      const adminService = await AdminService.getInstance();
      const organization = await adminService.getOrganization(
        'Chrysalis BLP Classic'
      );

      expect(typeof organization).to.equal('string');
    });
  });
});
