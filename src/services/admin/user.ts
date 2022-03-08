import { gql } from '@apollo/client/core';

export const UPLOAD_USERS = `
  mutation UploadUsersFromCSV($file: Upload!) {
    uploadUsersFromCSV(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

export const UPLOAD_USERS_GQL = gql`
  ${UPLOAD_USERS}
`;
