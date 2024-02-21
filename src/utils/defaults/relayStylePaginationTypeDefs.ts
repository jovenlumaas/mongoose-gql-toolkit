import gql from 'graphql-tag';
// types
import type { TSchemaModule } from '../../types';

export const relayStylePaginationTypeDefs: TSchemaModule = {
  typeDefs: gql`
    type PageInfo {
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: String!
      endCursor: String!
    }

    input EdgeArgs {
      first: Int
      after: String
      last: Int
      before: String
    }

    type JSONEdge {
      # cursor: String // <-- REMOVED to save bandwidth
      node: JSONObject
    }

    interface RelayConnection {
      pageInfo: PageInfo
      totalCount: Int
    }
  `,
};
