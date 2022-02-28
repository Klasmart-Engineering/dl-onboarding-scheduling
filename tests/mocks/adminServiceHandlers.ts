import { graphql } from 'msw';

export const adminServiceHandlers = [
  // Handles a "organizationsConnection" query
  graphql.query('getOrganization', (req, res, ctx) => {
    if (!req.headers.get('Authorization')) {
      // When not authenticated, respond with an error
      return res(
        ctx.errors([
          {
            message: 'Not authenticated',
            errorType: 'AuthenticationError',
          },
        ])
      );
    }

    // When authenticated and without pagination cursor, respond with a query payload
    return res(
      ctx.data({
        organizationsConnection: {
          totalCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor:
              'eyJvcmdhbml6YXRpb25faWQiOiIwMDFiZTg3OC0xMWMyLTQwZGMtYWQyNS1iZmJjYmY2ZjA5NjAifQ==',
            endCursor:
              'eyJvcmdhbml6YXRpb25faWQiOiIwMDFiZTg3OC0xMWMyLTQwZGMtYWQyNS1iZmJjYmY2ZjA5NjAifQ==',
          },
          edges: [
            {
              node: {
                id: '001be878-11c2-40dc-ad25-bfbcbf6f0960',
                name: 'Chrysalis BLP Classic',
              },
            },
          ],
        },
      })
    );
  }),
];
