import { GraphQLScalarType, Kind } from 'graphql';

const GraphQLDate = new GraphQLScalarType({
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
});

export default GraphQLDate;
