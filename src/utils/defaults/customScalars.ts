import gql from 'graphql-tag';
import { GraphQLScalarType, GraphQLList, Kind } from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
// types
import type { TSchemaModule } from '../../types';

// Scalar  and Interface Type Definitions

export const customScalars: TSchemaModule = {
  typeDefs: gql`
    scalar Date
    scalar JSONObject
    scalar JSONArray
  `,
  resolvers: {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value: any) {
        return new Date(value); // value from the client
      },
      serialize(value: any) {
        return new Date(value).getTime(); // value sent to the client
      },
      parseLiteral(ast: any) {
        if (ast.kind === Kind.INT) {
          return new Date(+ast.value); // ast value is always in string format
        } else if (ast.kind === Kind.STRING) {
          return new Date(ast.value).toISOString();
        }
        return null;
      },
    }),

    JSONObject: GraphQLJSONObject.toJSON(),
    JSONArray: new GraphQLList(GraphQLJSONObject),
  } as any,
};
