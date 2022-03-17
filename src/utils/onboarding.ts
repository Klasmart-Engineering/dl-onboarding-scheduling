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
  rows: string
) {
  const result = await uploadCsv(filePath, fileName);

  const onboardingResult = [
    {
      rows: rows,
      result: 'true',
      errors: [],
      end_at: Date.now(),
    },
  ];
  if (result.data.errors) {
    onboardingResult[0].result = 'false';
    onboardingResult[0].errors = result.data.errors[0].details.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any) => err.message
    );
  }
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
