import {
  ApolloClient,
  DocumentNode,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  TypedDocumentNode,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import fetch from 'cross-fetch';

import { Entity } from '../../types';
import { stringInject, Uuid } from '../../utils';

import { GET_CLASSES } from './class';
import { GET_ORGANIZATION, GET_ORGANIZATIONS } from './organization';

type SupportedConnections =
  | 'classesConnection'
  | 'organizationsConnection';

export type IdNameMapper = {
  id: Uuid;
  name: string;
};

export class AdminService {
  private static _instance: AdminService;
  public readonly context: { headers: { Authorization: string } };

  private constructor(
    private _client: ApolloClient<NormalizedCacheObject>,
    token: string
  ) {
    this.context = { headers: { Authorization: `${token}` } };
  }

  public static async getInstance() {
    if (this._instance) return this._instance;

    const token = process.env.STS_JWT;
    if (!token || token.length === 0) {
      throw new Error(`The STS_JWT environment variable was not set.`);
    }

    const httpLink = new HttpLink({
      uri: process.env.ADMIN_SERVICE_URL,
      fetch,
    });

    /**
     * Only retry network errors
     *
     * Reference: https://www.apollographql.com/docs/react/api/link/apollo-link-retry/
     */
    const retryLink = new RetryLink({
      delay: {
        initial: 300,
        max: Infinity,
        jitter: true,
      },
      attempts: {
        max: 5,
        retryIf: (error, _operation) => !!error,
      },
    });

    const errorLink = onError(({ graphQLErrors, networkError, response }) => {
      /**
       * GraphQL errors, will not retry
       *
       * - Syntax errors (e.g., a query was malformed) - 4xx error
       * - Validation errors (e.g., a query included a schema field that doesn't exist) - 4xx error
       * - Resolver errors (e.g., an error occurred while attempting to populate a query field) - 2xx error
       *
       * Reference: https://www.apollographql.com/docs/react/data/error-handling
       */
      if (graphQLErrors)
        graphQLErrors.forEach(({ message }) =>
          /* eslint-disable-next-line no-console */
          console.error(`[GraphQL error]: ${message}`)
        );

      // 4xx/5xx errors
      /* eslint-disable-next-line no-console */
      if (networkError) console.error(`[Network error]: ${networkError}`);

      if (response && response.errors) {
        response.errors.forEach((message) =>
          /* eslint-disable-next-line no-console */
          console.error(`[GraphQL error]: ${message}`)
        );
      }
    });

    try {
      const client = new ApolloClient({
        link: from([errorLink, retryLink, httpLink]),
        cache: new InMemoryCache(),
      });

      this._instance = new AdminService(client, token);
      /* eslint-disable-next-line no-console */
      console.info('Connected to KidsLoop admin service');
      return this._instance;
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error('❌ Failed to connect KidsLoop admin service');
      throw e;
    }
  }

  get client(): ApolloClient<NormalizedCacheObject> {
    return this._client;
  }

  public async getOrganization(orgName: string): Promise<Uuid> {
    const transformer = ({ id }: { id: string }) => id;
    const org = await this.traversePaginatedQuery(
      GET_ORGANIZATION,
      transformer,
      'organizationsConnection',
      { orgName }
    );
    if (org.length > 1)
      throw new Error(
        `Unexpectedly found more than one organization with the name ${orgName}, unable to identify which one should be used`
      );
    if (org.length === 0) throw new Error(`Organization ${orgName} not found`);
    return org[0];
  }

  public async getOrganizations(names: string[]): Promise<IdNameMapper[]> {
    const transformer = ({ id, name }: { id: string; name: string }) => ({
      id,
      name,
    });

    const conditions = this.buildNameConditions(names);
    const query = stringInject(GET_ORGANIZATIONS, {
      nameConditions: conditions,
    });
    if (query === undefined) {
      throw new Error(`Cannot prepare Admin Service organizations query`);
    }

    const organizations = await this.traversePaginatedQuery(
      gql(query),
      transformer,
      'organizationsConnection'
    );
    if (organizations.length === 0) throw new Error(`Organizations not found`);

    return organizations;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getClasses(names: string[]): Promise<any> {
    const transformer = ({
      id,
      name,
      studentsConnection,
      teachersConnection,
    }: {
      id: string;
      name: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      studentsConnection: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      teachersConnection: any;
    }) => {
      const studentIds = studentsConnection.edges.map(
        (student: { node: Record<string, string> }) => student.node.id
      );
      const teacherIds = teachersConnection.edges.map(
        (teacher: { node: Record<string, string> }) => teacher.node.id
      );
      return {
        id,
        name,
        studentIds,
        teacherIds,
      };
    };

    const conditions = this.buildNameConditions(names);
    const query = stringInject(GET_CLASSES, { nameConditions: conditions });
    if (query === undefined) {
      throw new Error(`Cannot prepare Admin Service classes query`);
    }

    const classes = await this.traversePaginatedQuery(
      gql(query),
      transformer,
      'classesConnection'
    );
    if (classes.length === 0) throw new Error(`Classes not found`);

    return classes;
  }

  private buildNameConditions(names: string[]): string {
    let conditions: string;
    if (names.length === 0) throw new Error(`Names is missing`);
    if (names.length === 1)
      conditions = `name: { operator: eq, value: "${names[0]}" }`;

    conditions =
      'OR: [' +
      names.map((name) => `{ name: { operator: eq, value: "${name}" } }`) +
      ']';

    return conditions;
  }

  /**
   * A helper function to send a request to a paginated API and walk the
   * full length of the cursor, collating all the responses before returning
   * an array of items
   *
   * @param {string} query - The GraphQL query to be sent
   * @param {function} transformer - A function that will be called on each
   * node within the response to convert the response data into the desired format
   * @param {object} variables - Any variables that need to be provided to the
   * GraphQL query
   * @returns {T[]} An array of the transformed type
   */
  private async traversePaginatedQuery<T, U>(
    query: DocumentNode | TypedDocumentNode,
    transformer: (responseData: U) => T,
    connectionName: SupportedConnections,
    variables?: Record<string, unknown>
  ): Promise<T[]> {
    let hasNextPage = true;
    let cursor = '';

    const result: T[] = [];
    while (hasNextPage) {
      /**
       * Don't need to handle errors here because:
       *
       * - 4xx/5xx were handled in `errorLink` when initializing `ApolloClient`
       * - 2xx errors won't exist in this case
       */
      const response = await this.client.query({
        query,
        variables: {
          count: 50,
          cursor,
          ...variables,
        },
        context: this.context,
      });
      const data = response.data;
      if (!data)
        throw new Error('Received no data property on the response object');

      const responseData = data[connectionName];
      if (!responseData || !responseData.pageInfo) {
        let entity = Entity.UNKNOWN;
        switch (connectionName) {
          case 'organizationsConnection':
            entity = Entity.ORGANIZATION;
            break;
          case 'classesConnection':
            entity = Entity.CLASS;
            break;
          default:
            break;
        }

        throw new Error(
          `When trying to parse the paginated query, found no pages of ${entity} data`
        );
      }
      hasNextPage = responseData.pageInfo.hasNextPage;
      cursor = responseData.pageInfo.endCursor;

      for (const { node } of responseData.edges) {
        result.push(transformer(node));
      }
    }
    return result;
  }
}
