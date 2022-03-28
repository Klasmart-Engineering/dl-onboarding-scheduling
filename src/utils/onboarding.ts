import fs from 'fs';

import axios from 'axios';
import FormData from 'form-data';

import { UPLOAD_CLASSES } from '../services/admin/class';
import { UPLOAD_SCHOOLS } from '../services/admin/school';
import { UPLOAD_USERS } from '../services/admin/user';
import { writeToCsv } from '../utils/csv';

export async function onboarding(
  filePath: string,
  outputFile: string,
  fileName: string,
  rows: string,
  startAt: number
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let errors: any[] = [];
  const onboardingResult = [
    {
      rows: rows,
      result: 'true',
      errors: errors,
      start_at: startAt,
      end_at: 0,
      duration_in_second: 0,
    },
  ];

  try {
    const result = await uploadCsv(filePath, fileName);

    if (result.data.errors) {
      onboardingResult[0].result = 'false';
      errors = result.data.errors[0].details.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any) => err.message
      );
    }
  } catch (error) {
    onboardingResult[0].result = 'false';
    errors = [
      {
        message: `Uploading CSV to Admin Service failed with error ${error}`,
      },
    ];
  }
  const endAt = Date.now();
  onboardingResult[0].end_at = endAt;
  onboardingResult[0].duration_in_second = endAt - startAt;
  onboardingResult[0].errors = errors;

  writeToCsv(outputFile, onboardingResult);
  fs.unlinkSync(filePath); // delete file after uploading to Admin Service
}

const uploadCsv = async (filePath: string, fileName: string) => {
  const formData = new FormData();
  const entity = fileName.split('.')[0];

  let mutation: string;
  switch (entity) {
    case 'classes':
      mutation = UPLOAD_CLASSES;
      break;
    case 'schools':
      mutation = UPLOAD_SCHOOLS;
      break;
    default:
      mutation = UPLOAD_USERS;
      break;
  }

  const queryString = {
    query: mutation,
    variables: {
      file: null,
    },
  };

  formData.append('operations', JSON.stringify(queryString));
  formData.append(
    'map',
    JSON.stringify({
      '0': ['variables.file'],
    })
  );
  formData.append('0', fs.createReadStream(filePath), fileName);

  return await axios.post(
    process.env.ADMIN_SERVICE_URL || 'http://localhost:8080/user',
    formData,
    {
      headers: {
        Authorization: process.env.STS_JWT || '',
        ...formData.getHeaders(),
      },
    }
  );
};
