import gql from 'graphql-tag';
import { GraphQLList } from 'graphql';

import GraphQLDate from '../scalars/GraphQLDate';
import GraphQLJSONObject from '../scalars/GraphQLJSONObject';

import type { TSchemaModule } from '../../types';

// Scalar  and Interface Type Definitions
export const customScalars: TSchemaModule = {
  typeDefs: gql`
    scalar Date
    scalar JSONObject
    scalar JSONArray
  `,
  resolvers: {
    Date: GraphQLDate,
    JSONObject: GraphQLJSONObject.toJSON(),
    JSONArray: new GraphQLList(GraphQLJSONObject),
  } as any,
};
