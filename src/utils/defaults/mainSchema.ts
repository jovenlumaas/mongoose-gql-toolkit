import gql from 'graphql-tag';
// types
import type { TSchemaModule } from '../../types';

export const mainTypeDefs: TSchemaModule = {
  typeDefs: gql`
    type Query {
      testQuery: String
    }

    type Mutation {
      testMutation: String
    }

    enum CacheControlScope {
      PUBLIC
      PRIVATE
    }

    directive @cacheControl(
      maxAge: Int # in seconds
      scope: CacheControlScope
      inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
  `,
  resolvers: {
    Query: {
      testQuery: async () => {
        return `test query passed! #${Math.floor(Math.random() * 10000 + 1)}`;
      },
    },
    Mutation: {
      testMutation: async () => {
        return `test mutation passed! #${Math.floor(Math.random() * 10000 + 1)}`;
      },
    },
  },
};
