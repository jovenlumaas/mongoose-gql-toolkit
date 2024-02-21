import type { TSchemaModule } from "../../types";

export const mergeSchema = <T extends (TSchemaModule | TSchemaModule[])[]>(
  schemaHandlers: T
): TSchemaModule[] => {
  return schemaHandlers.reduce((acc, schema) => {
    if (Array.isArray(schema)) {
      return [...acc, ...mergeSchema(schema)];
    } else {
      return [...acc, schema];
    }
  }, [] as any);
};
