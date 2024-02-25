import { makeSchemaCreator } from "./schema/createSchema";
import { createFetchMethods } from "./schema/resolvers/fetch";

// types
import type { TAuthValidations } from "./schema/resolvers";
import type { TResolverContext } from "../types";

type TGQLMethodOptions<
  TContext extends TResolverContext,
  TFetchTags,
  TModels,
  TSchemaContext
> = {
  fetchTags: TFetchTags;
  models: TModels;
  schemaContext: TSchemaContext;
  authValidations: TAuthValidations<TContext>;
};

export const createGraphqlMethods = <
  TContext extends TResolverContext,
  TFetchTags,
  /** You can provide additional context to 'CreateGraphQLSchema'. */
  TModels,
  /** Provide an object of mongoose models */
  TSchemaContext
>({
  fetchTags,
  models,
  schemaContext,
  authValidations,
}: TGQLMethodOptions<TContext, TFetchTags, TModels, TSchemaContext>) => {
  return {
    createGraphQLSchema: makeSchemaCreator<
      TContext,
      TFetchTags,
      TModels,
      TSchemaContext
    >({ fetchTags, models, schemaContext, authValidations }),
    fetch: createFetchMethods<TFetchTags>(fetchTags),
  };
};

export * from "./schema";
