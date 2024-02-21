import gql from 'graphql-tag';
// types
import type { TSchemaModule } from '../../types';

export const offsetLimitPaginationTypeDefs: TSchemaModule = {
  typeDefs: gql`
    type OffsetLimitPageInfo {
      page: Int
      limit: Int
      totalCount: Int
      totalPages: Int
      hasPreviousPage: Boolean
      hasNextPage: Boolean
    }

    type TOffsetLimitPaginationSearchResult {
      nodes: JSONArray
      pageInfo: OffsetLimitPageInfo
      totalCount: Int
    }

    input PageArgs {
      page: Int!
      limit: Int!
      sort: JSONObject
    }

    input OffsetLimitPageArgs {
      limit: Int
      offset: Int
      direction: String
    }

    input OffsetLimitPaginationInput {
      criteria: JSONArray
      results: JSONArray
      includeDeleted: Boolean
      pageArgs: OffsetLimitPageArgs
    }
  `,
};
