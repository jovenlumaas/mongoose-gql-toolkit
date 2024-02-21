import { GraphQLScalarType, Kind } from 'graphql';

const GraphQLJSONObject = new GraphQLScalarType({
  name: 'JSONObject',
  description: 'The `JSONObject` scalar type represents a JSON object.',
  // Serialize JSON object to string
  serialize(value: any) {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    throw new Error('JSONObject cannot represent non-object value: ' + value);
  },
  // Parse string to JSON object
  parseValue(value: any) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error('JSONObject cannot represent non-string value: ' + value);
    }
  },
  // Parse AST string representation to JSON object
  parseLiteral(ast: any) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch (error) {
        throw new Error('JSONObject cannot represent non-string value: ' + ast.value);
      }
    }
    throw new Error('JSONObject cannot represent non-string value: ' + ast.kind);
  },
});

export default GraphQLJSONObject;
