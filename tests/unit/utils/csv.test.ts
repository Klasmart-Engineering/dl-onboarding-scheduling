import fs from 'fs';
import path from 'path';

import { expect } from 'chai';

import { OUTPUT_DIR } from '../../../src/config';
import { parseCsv, processCsv, writeResultToCsv } from '../../../src/utils/csv';

// TODO: got some problems with fs sync methods, will fix later
xdescribe('utils/csv', () => {
  describe('#writeResultToCsv', () => {
    const resultCsvFilePath = `${OUTPUT_DIR}/result.csv`;
    const testResultCsvFilePath = `${OUTPUT_DIR}/resultTest.csv`;

    afterEach(() => {
      fs.unlinkSync(resultCsvFilePath);
      if (fs.existsSync(testResultCsvFilePath)) {
        fs.unlinkSync(testResultCsvFilePath);
      }
    });

    it('writes the result to the new file', () => {
      expect(fs.existsSync(resultCsvFilePath)).to.be.false;
      writeResultToCsv(resultCsvFilePath, [{ test: 'test' }]);

      const records = parseCsv(resultCsvFilePath, testResultCsvFilePath);
      expect(records).to.not.be.undefined;
      if (records !== undefined) {
        expect(records.length).to.eq(1);
      } else {
        expect(true).to.be.false;
      }
    });

    it('appends the new result (without header) to the existing file', () => {
      writeResultToCsv(resultCsvFilePath, [{ test: 'test' }]);

      writeResultToCsv(resultCsvFilePath, [{ test: 'test' }]);
      const records = parseCsv(resultCsvFilePath, testResultCsvFilePath);
      expect(records).to.not.be.undefined;
      if (records !== undefined) {
        expect(records.length).to.eq(2);
      } else {
        expect(true).to.be.false;
      }
    });
  });

  describe('#parseCsv', () => {
    const resultCsvFilePath = `${OUTPUT_DIR}/result.csv`;
    const testResultCsvFilePath = `${OUTPUT_DIR}/resultTest.csv`;

    afterEach(() => {
      fs.unlinkSync(resultCsvFilePath);
      if (fs.existsSync(testResultCsvFilePath)) {
        fs.unlinkSync(testResultCsvFilePath);
      }
    });

    it('writes error to file and returns undefined if input file does not exist', () => {
      const res = parseCsv('./abc.csv', resultCsvFilePath);
      expect(res).to.be.undefined;

      const errors = parseCsv(resultCsvFilePath, testResultCsvFilePath);
      expect(errors).to.not.be.undefined;
      if (errors !== undefined) {
        expect(errors.length).to.eq(1);
        expect(errors).to.be.eq([{ message: 'File does not exist.' }]);
      } else {
        expect(true).to.be.false;
      }
    });
  });

  describe('#processCsv', () => {
    const emptyCsvFilePath = path.resolve(
      __dirname,
      `../../fixtures/empty.csv`
    );
    const emptyTestCsvFilePath = `${OUTPUT_DIR}/empty.csv`;
    const resultCsvFilePath = `${OUTPUT_DIR}/result.csv`;
    const testResultCsvFilePath = `${OUTPUT_DIR}/resultTest.csv`;

    afterEach(() => {
      fs.unlinkSync(resultCsvFilePath);
      if (fs.existsSync(testResultCsvFilePath)) {
        fs.unlinkSync(testResultCsvFilePath);
      }
    });

    it('writes error to file if file is empty', () => {
      fs.copyFileSync(emptyCsvFilePath, emptyTestCsvFilePath);
      processCsv(emptyTestCsvFilePath, resultCsvFilePath);
      expect(fs.existsSync(emptyTestCsvFilePath)).to.be.false; // file is deleted automatically

      setTimeout(() => {
        /* does nothing */
      }, 10000);
      expect(fs.existsSync(resultCsvFilePath)).to.be.true;
      const errors = parseCsv(resultCsvFilePath, testResultCsvFilePath);
      expect(errors).to.not.be.undefined;
      if (errors !== undefined) {
        expect(errors.length).to.eq(1);
        expect(errors).to.be.eq([{ message: 'File is empty.' }]);
      }
    });
  });
});
