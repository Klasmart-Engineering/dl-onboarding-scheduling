import { gql } from '@apollo/client/core';

export const UPLOAD_SCHOOLS = `
  mutation UploadSchoolsFromCSV($file: Upload!) {
    uploadSchoolsFromCSV(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

export const UPLOAD_SCHOOLS_GQL = gql`
  ${UPLOAD_SCHOOLS}
`;
