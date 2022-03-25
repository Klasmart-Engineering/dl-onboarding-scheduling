import fs from 'fs';
import path from 'path';

import { Options } from 'csv-parse';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

import { UPLOAD_DIR } from '../config';

import { chunk } from './array';
import { deleteDotfile } from './cron';
import { onboarding } from './onboarding';

/**
 * This process runs in background so that we will not:
 *
 * - return result
 * - throw errors to express
 */
export const processCsv = async (
  filePath: string,
  outputFile: string,
  dotfilePath?: string
) => {
  const maxEntitiesPerFile = process.env.MAX_ENTITIES_PER_FILE
    ? parseInt(process.env.MAX_ENTITIES_PER_FILE, 10)
    : 100;
  const fileName = filePath.replace(/^.*[\\\/]/, ''); // handle both \ OR / in paths
  const rows = parseCsv(filePath, outputFile);

  if (rows === undefined) {
    // does nothing, already handled in `parseCsv`
    deleteDotfile(dotfilePath);
    return;
  }

  if (!rows.length) {
    deleteDotfile(dotfilePath);
    fs.unlinkSync(filePath);
    writeToCsv(outputFile, [{ message: 'File is empty.' }]);
    return;
  }
  fs.unlinkSync(filePath); // delete user uploaded file after parsing

  // Split CSV file into smaller ones then onboarding via Admin Service
  const chunks = chunk(rows, maxEntitiesPerFile);
  let firstRow = 0;
  let lastRow = 0;
  for (const [_index, data] of chunks.entries()) {
    const startAt = Date.now();
    firstRow = lastRow + 1;
    lastRow += data.length;
    const onboardFilePath = path.resolve(UPLOAD_DIR, 'onboarding/', fileName);
    writeToCsv(onboardFilePath, data);
    await onboarding(
      onboardFilePath,
      outputFile,
      fileName,
      `${firstRow} - ${lastRow}`,
      startAt
    );
  }

  deleteDotfile(dotfilePath);
  return rows;
};

export const parseCsv = (
  filePath: string,
  outputFile?: string,
  options?: Options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any>[] | undefined => {
  if (!fs.existsSync(filePath) && outputFile) {
    writeToCsv(outputFile, [{ message: 'File does not exist.' }]);
    return undefined;
  }
  let config = {
    delimiter: ',',
    columns: true,
  };
  if (options) {
    config = { ...options, ...config };
  }

  return parse(fs.readFileSync(filePath, 'utf8'), config);
};

export const writeToCsv = (
  outputFile: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[]
) => {
  const config = { header: true };
  if (fs.existsSync(outputFile)) {
    config.header = false;
  }

  const output = stringify(data, config);
  if (fs.existsSync(outputFile)) {
    fs.appendFileSync(outputFile, output);
  } else {
    fs.writeFileSync(outputFile, output);
  }
};
