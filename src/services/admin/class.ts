import { gql } from '@apollo/client/core';

export const UPLOAD_CLASSES = `
  mutation UploadClassesFromCSV($file: Upload!) {
    uploadClassesFromCSV(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

export const UPLOAD_CLASSES_GQL = gql`
  ${UPLOAD_CLASSES}
`;
