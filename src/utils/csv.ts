import fs from 'fs';

import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify';

/**
 * This process runs in background so that we will not:
 *
 * - return result
 * - throw errors to express
 */
export const processCsv = (filePath: string, outputFile: string) => {
  const rows = parseCsv(filePath, outputFile);

  if (rows === undefined) {
    // does nothing, already handled in `parseCsv`
    return;
  }

  if (!rows.length) {
    fs.unlinkSync(filePath);
    writeResultToCsv(outputFile, [{ message: 'File is empty.' }]);
    return;
  }

  // TODO: split to smaller files then send them to Admin Service
  // console.log(rows);
};

export const parseCsv = (
  filePath: string,
  outputFile: string
): Record<string, string>[] | undefined => {
  if (!fs.existsSync(filePath)) {
    writeResultToCsv(outputFile, [{ message: 'File does not exist.' }]);
    return undefined;
  }

  return parse(fs.readFileSync(filePath, 'utf8'), {
    delimiter: ',',
    columns: true,
  });
};

export const writeResultToCsv = (
  outputFile: string,
  data: Record<string, string>[]
) => {
  const config = { header: true };
  if (fs.existsSync(outputFile)) {
    config.header = false;
  }

  stringify(data, config, (_error, output) => {
    if (fs.existsSync(outputFile)) {
      fs.appendFileSync(outputFile, output);
    } else {
      fs.writeFileSync(outputFile, output);
    }
  });
};
