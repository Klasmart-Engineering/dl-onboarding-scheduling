import { OUTPUT_DIR, UPLOAD_DIR } from '../config';

import { processCsv } from './csv';

export const onboarding = (type: string) => {
  const fileName = `${type}.csv`;

  processCsv(`${UPLOAD_DIR}/${fileName}`, `${OUTPUT_DIR}/${fileName}`);
};
