import fs from 'fs';

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';

import app from '../../src/app';
import { OUTPUT_DIR, UPLOAD_DIR } from '../../src/config';

use(chaiAsPromised);

const requestWithSupertest = supertest(app);

describe('POST /schools', () => {
  beforeEach(async () => {
    // something here
  });

  describe('returns 400', () => {
    it('when the file is missing', async () => {
      const res = await requestWithSupertest.post('/schools').send();

      expect(res.status).to.eq(400);
      expect(res.body.message).is.eq('File is required.');
    });

    it('when the file is not CSV', async () => {
      const res = await requestWithSupertest
        .post('/schools')
        .attach('file', 'tests/fixtures/example.txt');

      expect(res.status).to.eq(400);
      expect(res.body.message).is.eq('Please upload only CSV file.');
    });

    it('when the file is already existed', async () => {
      // This will upload the file successfully
      await requestWithSupertest
        .post('/schools')
        .attach('file', 'tests/fixtures/example.csv');

      const filePath = UPLOAD_DIR + '/schools.csv';
      const res = await requestWithSupertest
        .post('/schools')
        .attach('file', 'tests/fixtures/example.csv');

      expect(res.status).to.eq(400);
      expect(res.body.message).is.eq(
        'Please try again later, schools are being onboard.'
      );
      fs.unlinkSync(filePath);
    });

    it('when the file size is exceeded', async () => {
      const res = await requestWithSupertest
        .post('/schools')
        .attach('file', 'tests/fixtures/fileSizeExceeded.csv');

      expect(res.status).to.eq(400);
      expect(res.body.message).is.eq('File too large');
    });
  });

  describe('writes error(s) to output file schools.csv & delete uploaded empty file', () => {
    it('when file is empty', async () => {
      const filePath = UPLOAD_DIR + '/schools.csv';
      const outputFilePath = OUTPUT_DIR + '/schools.csv';
      const res = await requestWithSupertest
        .post('/schools')
        .attach('file', 'tests/fixtures/empty.csv');

      expect(res.status).to.eq(200);
      expect(fs.existsSync(filePath)).to.be.false;
      expect(fs.existsSync(outputFilePath)).to.be.true;
      fs.unlinkSync(outputFilePath);
    });
  });

  it('returns 200 and uploads file successfully', async () => {
    const filePath = UPLOAD_DIR + '/schools.csv';
    const res = await requestWithSupertest
      .post('/schools')
      .attach('file', 'tests/fixtures/example.csv');

    expect(res.status).to.eq(200);
    expect(fs.existsSync(filePath)).to.be.true;
    fs.unlinkSync(filePath);
  });
});
