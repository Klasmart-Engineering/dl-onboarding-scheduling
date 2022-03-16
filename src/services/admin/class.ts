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

export const GET_CLASSES = `
  query getClassesByNames(
    $count: PageSize
    $cursor: String
  ) {
    classesConnection(
      direction: FORWARD
      directionArgs: { count: $count, cursor: $cursor }
      filter: {
        status: { operator: eq, value: "active" }
        {nameConditions}
      }
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          studentsConnection {
            edges {
              node {
                id
                familyName
                givenName
              }
            }
          }
          teachersConnection {
            edges {
              node {
                id
                familyName
                givenName
              }
            }
          }
        }
      }
    }
  }
`
