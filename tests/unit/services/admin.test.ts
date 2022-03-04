import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { config } from 'dotenv';

import { AdminService } from '../../../src/services';
import { adminServiceServer } from '../../mocks/adminServiceServer';

config();
chai.use(spies);

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
